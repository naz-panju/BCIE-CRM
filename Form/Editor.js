import React, { useEffect, useState } from 'react';
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
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
        () => EditorState.createWithContent(
            ContentState.createFromBlockArray(
                htmlToDraft(props.val ? props.val : "<p> </p>")
            )
        ),
    );

    // const uploadImageCallBack = async (file) => {

    //     const data = new FormData();
    //     data.append("file", file)
    //     let response = await Files.store(data);
    //     console.log("uploadImageCallBack", response.data.data.file)
    //     return { data: { link: response.data.data.file } };
    // }

    // Define editor styles for multiline input



    useEffect(() => {

        setEditorState(EditorState.createWithContent(
            ContentState.createFromBlockArray(
                htmlToDraft(props.val ? props.val : "<p> </p>")
            )
        ))
    }, [typeof props.val])

    return (

        <EditorDraft
            editorClassName="custom-editor-container"
            editorState={editorState ? editorState : null}
            onEditorStateChange={e => {
                setEditorState(e)
                props.onValueChange(draftToHtml(convertToRaw(e.getCurrentContent())));
            }}
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
            //     },                // inline: { inDropdown: true },
            //     // list: { inDropdown: true },
            //     // textAlign: { inDropdown: true },
            //     // link: { inDropdown: false },
            //     // history: { inDropdown: false },
            // }}
        />

    );
};

export default Editor;


// import { Editor } from "react-draft-wysiwyg";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// import { ContentState, EditorState, convertToRaw } from 'draft-js';
// import dynamic from 'next/dynamic';
// import { useEffect, useState } from 'react';
// const htmlToDraft = dynamic(() => import('html-to-draftjs'), { ssr: false });
// // import draftToHtml from "draftjs-to-html"; 

// // Dynamically import the Editor component with SSR disabled
// const Editor = dynamic(
//     () => import('react-draft-wysiwyg').then(mod => mod.Editor),
//     { ssr: false }
// );


// const Editorr = (props) => {

//     const [editorState, setEditorState] = useState(
//         () => EditorState.createWithContent(
//             ContentState.createFromBlockArray(
//                 htmlToDraft(props.val ? props.val : "<p> </p>")
//             )
//         ),
//     );

//     useEffect(() => {
//         setEditorState(EditorState.createWithContent(
//             ContentState.createFromBlockArray(
//                 htmlToDraft(props.val ? props.val : "<p> </p>").contentBlocks
//             )
//         ));
//     }, [props.val]);

//     return (
//         <Editor
//             editorState={editorState}
//             toolbarClassName="toolbarClassName"
//             wrapperClassName="wrapperClassName"
//             editorClassName="editorClassName"
//             onEditorStateChange={e => {
//                 setEditorState(e);
//                 props.onValueChange(draftToHtml(convertToRaw(e.getCurrentContent())));
//             }}
//         />
//     )
// }

// export default Editorr