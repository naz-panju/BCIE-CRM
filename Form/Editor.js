import React, { useEffect, useState } from 'react';
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from 'draftjs-to-html';
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
    const [editorState, setEditorState] = useState(
        () => EditorState.createWithContent(
            ContentState.createFromBlockArray(
                htmlToDraft(props.val ? props.val : "<p> </p>")
            )
        ),
    );

    useEffect(() => {
        setEditorState(EditorState.createWithContent(
            ContentState.createFromBlockArray(
                htmlToDraft(props.val ? props.val : "<p> </p>")
            )
        ));
    }, [props.val]);

    return (
        <EditorDraft
            editorClassName="custom-editor-container"
            editorState={editorState ? editorState : null}
            onEditorStateChange={e => {
                setEditorState(e);
                props.onValueChange(draftToHtml(convertToRaw(e.getCurrentContent())));
            }}
            toolbar={{
                options: ['inline', 'blockType', 'fontSize', 'fontFamily'],
                inline: {
                    options: ['bold', 'italic', 'underline'],
                },
                blockType: {
                    inDropdown: true,
                    options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote'],
                },
                fontSize: {
                    options: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
                },
                fontFamily: {
                    options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Verdana'],
                },
            }}
        />
    );
};

export default Editor;
