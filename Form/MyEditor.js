import { ImageUploadApi } from '@/data/Endpoints/ImageUploader';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React, { useState } from 'react';

function MyEditor(props) {
    const [editorData, setEditorData] = useState('');


    function MyCustomUploadAdapterPlugin(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            // console.log(loader);
            return {
                upload: async () => {
                    const data = new FormData();
                    data.append('file', await loader.file);
                    

                    // Replace 'upload_url' with your server's upload endpoint
                    const response = await ImageUploadApi.upload({ file: data })
                    // console.log(response);

                    return {
                        default: response.url // assuming the server responds with the URL of the uploaded image
                    };
                },
                abort: () => { }
            };
        };
    }


    return (
        <div>
            <CKEditor

                editor={ClassicEditor}
                data={props?.value}

                config={{
                    extraPlugins: [MyCustomUploadAdapterPlugin],
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