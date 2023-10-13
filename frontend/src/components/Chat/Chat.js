import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../../firebase";
import {
    collection,
    addDoc,
    where,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
} from "firebase/firestore";
import ChatroomBar from "./ChatroomBar";

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [disableText, setDisableText] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [modifiedMessage, setModifiedMessage] = useState("");
    const [requiresModification, setRequiresModification] = useState(false);
    const messagesRef = collection(db, "messages");
    const room = "toxic_chat";
    const dummy = useRef();

    useEffect(() => {
        const queryMessages = query(
            messagesRef,
            where("room", "==", room),
            orderBy("createdAt")
        );
        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
                messages.push({ ...doc.data(), id: doc.id });
            });
            setMessages(messages);
            setTimeout(
                () => dummy.current.scrollIntoView({ behavior: "smooth" }),
                0
            );
        });
        return () => {
            unsubscribe();
        };
    }, []);

    async function addMessage(msg) {
        await addDoc(messagesRef, {
            text: msg,
            createdAt: serverTimestamp(),
            user: auth.currentUser.displayName,
            uid: auth.currentUser.uid,
            pfp: auth.currentUser.photoURL,
            room: room,
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (newMessage === "") return;
        setNewMessage("Sending...");
        setDisableText(true);

        fetch("http://127.0.0.1:5000/detox", {
            method: "POST",
            body: JSON.stringify({
                text: newMessage,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                const modifiedText = data.text;
                if (modifiedText !== newMessage) {
                    setModifiedMessage(modifiedText);
                    setRequiresModification(true);
                } else {
                    setRequiresModification(false);
                    addMessage(newMessage);
                }
            })
            .catch((err) => {
                console.log(err.message);
            })
            .finally(() => {
                setNewMessage("");
                setDisableText(false);
            });
    };

    return (
        <div className="chat-parent">
            <ChatroomBar name={room} />
            <div className="messages">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={
                            message.uid === auth.currentUser.uid
                                ? "chat-bubble sender"
                                : "chat-bubble"
                        }
                    >
                        <div className="message-container">
                            <p className="sender-name">{message.user}</p>
                            <p className="message">{message.text}</p>
                        </div>
                    </div>
                ))}
                {requiresModification && (
                    <div className="chat-bubble modified">
                        <div className="message-container">
                            <p className="sender-name">Modified Message</p>
                            <p className="message">{modifiedMessage}</p>
                        </div>
                        <button
                            onClick={() => {
                                addMessage(modifiedMessage);
                                setRequiresModification(false);
                            }}
                            // onClick={() => addMessage(modifiedMessage)}
                            className="edit-button"
                        >
                            Send Modified
                        </button>
                    </div>
                )}
                <span ref={dummy}></span>
            </div>

            <form onSubmit={handleSubmit} autoComplete="off">
                <div className="chat-textbox">
                    <input
                        id="message-input"
                        type="text"
                        disabled={disableText}
                        value={newMessage}
                        onChange={(event) => setNewMessage(event.target.value)}
                        placeholder="Type your message here..."
                    />
                    <button id="send-button" type="submit">
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}
