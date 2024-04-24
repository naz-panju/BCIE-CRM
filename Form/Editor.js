import React, { useEffect, useState } from 'react';
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from 'draftjs-to-html';
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import htmlToDraft from 'html-to-draftjs';
let htmlToDraft;
if (typeof window !== 'undefined') {
    htmlToDraft = require('html-to-draftjs').default;
}


// // Conditionally import EditorDraft only in the browser environment
let EditorDraft;
if (typeof window !== 'undefined') {
    EditorDraft = require("react-draft-wysiwyg").Editor;
    require("react-draft-wysiwyg/dist/react-draft-wysiwyg.css");
}

const Editor = (props) => {
    const [value_, setValue] = useState();
    const [editorState, setEditorState] = useState(
        () => {
            if (props.initialHtml) {
                const contentBlock = htmlToDraft(props.initialHtml);
                if (contentBlock) {
                    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                    return EditorState.createWithContent(contentState);
                }
            }
            return EditorState.createEmpty();
        }
    );


    // const uploadImageCallBack = async (file) => {

    //     const data = new FormData();
    //     data.append("file", file)
    //     let response = await Files.store(data);
    //     console.log("uploadImageCallBack", response.data.data.file)
    //     return { data: { link: response.data.data.file } };
    // }

    // Define editor styles for multiline input

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
    

    useEffect(() => {

        setEditorState(EditorState.createWithContent(
            ContentState.createFromBlockArray(
                htmlToDraft(props.val ? props.val : "<p> </p>")
            )
        ))
    }, [typeof props.val])

    return (

        <EditorDraft
             key={props?.key}
            editorClassName="custom-editor-container"
            editorState={editorState}
            onEditorStateChange={(e) => {
                setEditorState(e);
                props.onValueChange(draftToHtml(convertToRaw(e.getCurrentContent())));
            }}
            toolbar={{
                image: {
                    uploadCallback: uploadCallback,
                    alt: { present: true, mandatory: false }
                },
                
            }}
        />
    );
};

export default Editor;

 //     toolbar={{
        //         options: ['image',],
                            
        //         image: {
        //         uploadEnabled: true,
        //         uploadCallback: uploadCallback,
        //         previewImage: true,
        //         inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
        //         alt: { present: false, mandatory: false },
        //         defaultSize: {
        //              height: 'auto',
        //              width: 'auto',
        //         },
        //      },
        //    }}
            // toolbar={{
            //     options: ['inline', 'blockType', 'fontSize', 'fontFamily'], // Include essential options
            //     inline: {
            //         options: ['bold', 'italic', 'underline'], // Include inline formatting options
            //     },
            //     blockType: {
            //         inDropdown: true, // Show block type dropdown
            //         options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote'], // Include block type options
            //     },
            //     fontSize: {
            //         options: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], // Include font size options
            //     },
            //     fontFamily: {
            //         options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Verdana'], // Include font family options
            //     },  
                          // inline: { inDropdown: true },
            //     // list: { inDropdown: true },
            //     // textAlign: { inDropdown: true },
            //     // link: { inDropdown: false },
            //     // history: { inDropdown: false },
            // }}