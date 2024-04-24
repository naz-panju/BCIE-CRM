
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React, { useState } from 'react';

function MyEditor(props) {
    const [editorData, setEditorData] = useState('');

    function MyCustomUploadAdapterPlugin(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return {
                upload: async () => {
                    const file = await loader;
                    return new Promise((resolve, reject) => {
                        if (!file) {
                            reject('No file selected');
                            return;
                        }
    
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            resolve({ default: event.target.result });
                        };
                        reader.onerror = (error) => {
                            reject(error);
                        };
                        reader.readAsDataURL(file);
                    });
                },
            };
        };
    }
    

    // function MyCustomUploadAdapterPlugin(editor) {
    //     editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    //         return {
    //             upload: async () => {
    //                 const data = new FormData();
    //                 data.append('file', await loader.file);

    //                 // Replace 'upload_url' with your server's upload endpoint
    //                 const response = await fetch('upload_url', {
    //                     method: 'POST',
    //                     body: data
    //                 });

    //                 console.log(response);

    //                 return {
    //                     default: response.url // assuming the server responds with the URL of the uploaded image
    //                 };
    //             },
    //             abort: () => { }
    //         };
    //     };
    // }


    const uploadCallback = (file) => {
        return new Promise(
            (resolve, reject) => {
                if (file) {
                    let reader = new FileReader();
                    reader.onload = (e) => {
                        resolve({ data: { link: e.target.result } });
                    };
                    reader.readAsDataURL(file);
                }
            }
        );
    };

    const insertImage = async () => {
        // Open file picker dialog to select image
        const file = await openFilePicker();

        // Upload the selected image file
        const imageUrl = await uploadImage(file);

        // Insert the image into the editor at the current cursor position
        const editor = editorInstance.current;
        editor.model.change(writer => {
            const imageElement = writer.createElement('image', {
                src: imageUrl
            });
            editor.model.insertContent(imageElement);
        });
    };

    const toolbarConfig = [
        'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote',
        'undo', 'redo', 'fontSize', // Add fontSize to the toolbar
    ];



    return (
        <div>
            <CKEditor
                editor={ClassicEditor}
                data={props?.value}
                config={{
                    extraPlugins: [MyCustomUploadAdapterPlugin],
                    toolbar: toolbarConfig,
                   
                }}
                
                toolbar={{
                    fontFamily: {
                        options: [
                            'default',
                            'Ubuntu, Arial, sans-serif',
                            'Ubuntu Mono, Courier New, Courier, monospace'
                        ]
                    },
                    
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setEditorData(data);
                    props?.onValueChange(data)
                }}
                className='ckeditor-container'

            />
        </div>
    );
}

export default MyEditor;