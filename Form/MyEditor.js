// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import React, { useState, useEffect, useRef } from 'react';
// import { ImageUploadApi } from '@/data/Endpoints/ImageUploader';

function MyEditor(props) {
    // const [editorData, setEditorData] = useState('');
    // const editorRef = useRef(null);

    // function MyCustomUploadAdapterPlugin(editor) {
    //     editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    //         return {
    //             upload: async () => {
    //                 const data = new FormData();
    //                 data.append('file', await loader.file);

    //                 try {
    //                     const response = await ImageUploadApi.upload(data);
    //                     console.log(response);
    //                     return { default: response.data.data.file_path };
    //                 } catch (error) {
    //                     console.error('Image upload failed:', error);
    //                     return { default: '' };
    //                 }
    //             },
    //             abort: () => { }
    //         };
    //     };
    // }

    // const insertText = (text) => {
    //     if (editorRef.current) {
    //         const editorInstance = editorRef.current;
    //         editorInstance.model.change(writer => {
    //             const insertPosition = editorInstance.model.document.selection.getFirstPosition();
    //             writer.insertText(text, insertPosition);
    //         });

    //         const data = editorInstance.getData();
    //         setEditorData(data);
    //         if (props?.onValueChange) {
    //             props.onValueChange(data);
    //         }
    //     }
    // };

    // useEffect(() => {
    //     if (props?.copied) {
    //         insertText(props.copied);
    //     }
    // }, [props?.copied]);

    // useEffect(() => {
    //     if (props?.val) {
    //         setEditorData(props.val);
    //     }
    // }, [props?.val]);

    return (
        <div>
            {/* <CKEditor
                editor={ClassicEditor}
                data={editorData}
                config={{
                    extraPlugins: [MyCustomUploadAdapterPlugin],
                    image: {
                        toolbar: [
                            'imageStyle:full',
                            'imageStyle:side',
                            '|',
                            'imageTextAlternative',
                            'imageResize'
                        ],
                        resizeOptions: [
                            {
                                name: 'imageResize:original',
                                label: 'Original',
                                value: null
                            },
                            {
                                name: 'imageResize:50',
                                label: '50%',
                                value: '50'
                            },
                            {
                                name: 'imageResize:75',
                                label: '75%',
                                value: '75'
                            }
                        ],
                        resizeUnit: '%'
                    }
                }}
                onReady={(editor) => {
                    editorRef.current = editor;
                    setEditorData(props?.val || '');
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setEditorData(data);
                    if (props?.onValueChange) {
                        props.onValueChange(data);
                    }
                }}
                className='ckeditor-container'
            /> */}
        </div>
    );
}

export default MyEditor;
