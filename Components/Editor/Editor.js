import { useState, useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import {
	ClassicEditor,
	AccessibilityHelp,
	Autoformat,
	AutoImage,
	AutoLink,
	Autosave,
	Bold,
	CloudServices,
	Code,
	CodeBlock,
	Essentials,
	FindAndReplace,
	FontBackgroundColor,
	FontColor,
	FontFamily,
	FontSize,
	GeneralHtmlSupport,
	Heading,
	HtmlEmbed,
	ImageBlock,
	ImageInline,
	ImageInsert,
	ImageInsertViaUrl,
	ImageResize,
	ImageToolbar,
	ImageUpload,
	Italic,
	Link,
	Paragraph,
	SelectAll,
	ShowBlocks,
	SimpleUploadAdapter,
	Table,
	TableCaption,
	TableCellProperties,
	TableColumnResize,
	TableProperties,
	TableToolbar,
	TextTransformation,
	Undo,
	ImageCaption,
	ImageStyle,
	ImageTextAlternative,
	SourceEditing
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import { ImageUploadApi } from '@/data/Endpoints/ImageUploader';
import toast from 'react-hot-toast';


export default function CKEditorBox(props) {
	const editorContainerRef = useRef(null);
	const [editorData, setEditorData] = useState('');
	const editorRef = useRef(null);
	const [isLayoutReady, setIsLayoutReady] = useState(false);

	const insertText = (text) => {
		if (editorRef.current) {
			const editorInstance = editorRef.current;
			editorInstance.model.change(writer => {
				const insertPosition = editorInstance.model.document.selection.getFirstPosition();
				writer.insertText(text, insertPosition);
			});

			const data = editorInstance.getData();
			setEditorData(data);
			if (props?.onValueChange) {
				props.onValueChange(data);
			}
		}
	};
	useEffect(() => {
		if (props?.copied) {
			insertText(props.copied);
		}
	}, [props?.copied]);

	useEffect(() => {
		if (props?.val) {
			setEditorData(props.val);
		}
	}, [props?.val]);

	useEffect(() => {
		setIsLayoutReady(true);

		return () => setIsLayoutReady(false);
	}, []);

	function MyCustomUploadAdapterPlugin(editor) {
		editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
			return {
				upload: async () => {
					const data = new FormData();
					data.append('file', await loader.file);

					try {
						const response = await ImageUploadApi.upload(data);
						console.log(response);
						return { default: response.data.data.file_path };
					} catch (error) {
						toast.error(error?.response?.data?.message)
						console.error('Image upload failed:', error);
						return { default: '' };
					}
				},
				abort: () => { }
			};
		};
	}

	const editorConfig = {
		extraPlugins: [MyCustomUploadAdapterPlugin],
		toolbar: {
			items: [
				'undo',
				'redo',
				'|',
				'showBlocks',
				'findAndReplace',
				'selectAll',
				'|',
				'heading',
				'|',
				'fontSize',
				'fontFamily',
				'fontColor',
				'fontBackgroundColor',
				'|',
				'bold',
				'italic',
				'insertImage',
				'|',
				'code',
				'link',
				'insertTable',
				'codeBlock',
				'htmlEmbed',
				'|',
				'accessibilityHelp'
			],
			shouldNotGroupWhenFull: false
		},
		plugins: [
			AccessibilityHelp,
			Autoformat,
			AutoImage,
			AutoLink,
			Autosave,
			Bold,
			CloudServices,
			Code,
			CodeBlock,
			Essentials,
			FindAndReplace,
			FontBackgroundColor,
			FontColor,
			FontFamily,
			FontSize,
			GeneralHtmlSupport,
			Heading,
			HtmlEmbed,
			ImageBlock,
			ImageCaption,
			ImageInline,
			ImageInsert,
			ImageInsertViaUrl,
			ImageResize,
			ImageStyle,
			ImageTextAlternative,
			ImageToolbar,
			ImageUpload,
			Italic,
			Link,
			Paragraph,
			SelectAll,
			SourceEditing,
			ShowBlocks,
			SimpleUploadAdapter,
			Table,
			TableCaption,
			TableCellProperties,
			TableColumnResize,
			TableProperties,
			TableToolbar,
			TextTransformation,
			Undo
		],
		fontFamily: {
			supportAllValues: true
		},
		fontSize: {
			options: [10, 12, 14, 'default', 18, 20, 22],
			supportAllValues: true
		},
		heading: {
			options: [
				{
					model: 'paragraph',
					title: 'Paragraph',
					class: 'ck-heading_paragraph'
				},
				{
					model: 'heading1',
					view: 'h1',
					title: 'Heading 1',
					class: 'ck-heading_heading1'
				},
				{
					model: 'heading2',
					view: 'h2',
					title: 'Heading 2',
					class: 'ck-heading_heading2'
				},
				{
					model: 'heading3',
					view: 'h3',
					title: 'Heading 3',
					class: 'ck-heading_heading3'
				},
				{
					model: 'heading4',
					view: 'h4',
					title: 'Heading 4',
					class: 'ck-heading_heading4'
				},
				{
					model: 'heading5',
					view: 'h5',
					title: 'Heading 5',
					class: 'ck-heading_heading5'
				},
				{
					model: 'heading6',
					view: 'h6',
					title: 'Heading 6',
					class: 'ck-heading_heading6'
				}
			]
		},
		htmlSupport: {
			allow: [
				{
					name: /^.*$/,
					styles: true,
					attributes: true,
					classes: true
				}
			]
		},
		image: {
			toolbar: [
				'toggleImageCaption',
				'imageTextAlternative',
				'|',
				'imageStyle:inline',
				'imageStyle:wrapText',
				'imageStyle:breakText',
				'|',
				'resizeImage'
			]
		},
		link: {
			addTargetToExternalLinks: true,
			defaultProtocol: 'https://',
			decorators: {
				toggleDownloadable: {
					mode: 'manual',
					label: 'Downloadable',
					attributes: {
						download: 'file'
					}
				}
			}
		},
		// placeholder: 'Type or paste your content here!',
		table: {
			contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
		}
	};

	return (
		<div>
			<div className="main-container">
				<div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
					<div className="editor-container__editor">
						<div>{isLayoutReady && <CKEditor editor={ClassicEditor} config={editorConfig} data={editorData} onChange={(event, editor) => {
							const data = editor.getData();
							setEditorData(data);
							if (props?.onValueChange) {
								props.onValueChange(data);
							}
						}}
							onReady={(editor) => {
								editorRef.current = editor;
								setEditorData(props?.val || '');
							}}
						/>}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
