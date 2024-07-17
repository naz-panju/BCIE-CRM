import { ImageUploadApi } from '@/data/Endpoints/ImageUploader';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React, { useState, useEffect, useRef } from 'react';


function MyEditor(props) {
    const [editorData, setEditorData] = useState(props.val || '');
    const editorRef = useRef(null);

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
                        console.error('Image upload failed:', error);
                        return { default: '' };
                    }
                },
                abort: () => { }
            };
        };
    }

    // Function to insert text into the editor
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

    // Handle props changes and insert text
    useEffect(() => {
        if (props?.copied) {
            insertText(props.copied);
        }
    }, [props?.copied]);

    // Handle initial value setting
    useEffect(() => {
        if (props?.val) {
            setEditorData(props.val);
        }
    }, [props?.val]);
    console.log(props?.val);

    return (
        <div>
            <CKEditor
                editor={ClassicEditor}
                data={editorData}
                config={{
                    extraPlugins: [MyCustomUploadAdapterPlugin],
                }}
                onReady={(editor) => {
                    editorRef.current = editor;
                    if (props?.val) {
                        editor.setData(props.val);
                    }
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setEditorData(data);
                    if (props?.onValueChange) {
                        props.onValueChange(data);
                    }
                }}
                className='ckeditor-container'
            />
        </div>
    );
}

export default MyEditor;
