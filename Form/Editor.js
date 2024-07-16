import React, { useEffect, useState } from 'react';
import { EditorState, convertToRaw, ContentState, Modifier, SelectionState } from "draft-js";
import draftToHtml from 'draftjs-to-html';
import { ImageUploadApi } from '@/data/Endpoints/ImageUploader';
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



    const uploadCallback = async (file) => {
        // console.log(file);
        const data = new FormData();
        data.append('file', file);
        try {
            const response = await ImageUploadApi.upload(data);
            // console.log(response);
            return { data: { link: response.data.data.file_path } };
        } catch (error) {
            console.error('Image upload failed:', error);
            return { data: { link: '' } };
        }
    };
    

    useEffect(() => {

        setEditorState(EditorState.createWithContent(
            ContentState.createFromBlockArray(
                htmlToDraft(props.val ? props.val : "<p> </p>")
            )
        ))
    }, [typeof props.val])

    const insertText = (text) => {
        const contentState = editorState.getCurrentContent();
        const selectionState = editorState.getSelection();

        if (selectionState.isCollapsed()) {
            // Insert text at the cursor position
            const newContentState = Modifier.insertText(contentState, selectionState, text);
            const newEditorState = EditorState.push(editorState, newContentState, 'insert-characters');
            setEditorState(newEditorState);
            props.onValueChange(draftToHtml(convertToRaw(newEditorState.getCurrentContent())));
        } else {
            // Replace the selected text with the new text
            const newContentState = Modifier.replaceText(contentState, selectionState, text);
            const newEditorState = EditorState.push(editorState, newContentState, 'replace-characters');
            setEditorState(newEditorState);
            props.onValueChange(draftToHtml(convertToRaw(newEditorState.getCurrentContent())));
        }
    };


    useEffect(() => {
        if(props?.copied){
            insertText(props?.copied)
        }
    }, [props?.copied])
    

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

