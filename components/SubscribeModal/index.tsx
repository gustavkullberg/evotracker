import React, { useRef, useState } from "react";
import styles from "./subscribeModal.module.css";
import { useOutsideClick } from "../../utils";
import Modal from "react-modal"
import { Switch } from "../";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: "#1b2631",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }
};

const headerStyle = {
    height: "70px",
    width: "100%",
    backgroundColor: "white",
    color: "#1b2631",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center"
}

const emailIsValid = (email): boolean => {
    const atposition = email.indexOf("@");
    const dotposition = email.lastIndexOf(".");
    if (atposition < 1 || dotposition < atposition + 2 || dotposition + 2 >= email.length) {
        return false;
    }
    return true;

}

export const SubscribeModal = ({ isOpen, closeModal, selectedGameShow }) => {
    const [isChecked, setIsChecked] = useState(false);
    const [email, setEmail] = useState("");
    const [validationError, setValidationError] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [isUnsubscribing, setIsUnsubscribing] = useState()

    const validateAndSubmitSubscription = (email) => {

        if (!emailIsValid(email)) {
            setValidationError("Please enter a valid e-mail address");
        } else if (!isChecked) {
            setValidationError("You must approve that Evotracker store your E-mail");
        } else {
            setValidationError("");

            setIsPosting(true);
            fetch("/api/subscribe", { method: "POST", body: JSON.stringify({ game: selectedGameShow, email }) })
                .then(response => response.json())
                .then((json) => {
                    console.log(json)
                    setIsPosting(false)
                    if (json.status === "ALREADY_SUBSCRIBED") {
                        setValidationError("Email already subscribed.");
                    } else {
                        setEmail("");
                        setIsChecked(false);
                        closeModal();
                    }
                }).catch(e => console.log("failed to subscribe", e))

        }

    }

    const validateAndSubmitUnsubscription = (email) => {
        if (!emailIsValid(email)) {
            setValidationError("Please enter a valid e-mail address");
        } else {
            setValidationError("");
            setIsPosting(true);
            fetch("api/unsubscribe", { method: "POST", body: JSON.stringify({ game: selectedGameShow, email }) }).then(response => response.json()).then((json) => {
                setIsPosting(false)
                if (json.status === "EMAIL_NOT_SUBSCRIBED") {
                    setValidationError("Email not subscribed.");
                } else {
                    setEmail("");
                    setIsChecked(false);
                    closeModal();
                }
            });
        }
    }

    return <Modal
        isOpen={isOpen}
        onAfterOpen={() => console.log("opened")}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal" >

        <div style={headerStyle}>
            <h2>{isUnsubscribing ? "Unsubscribe" : "Subscribe"}</h2>
            <Switch isChecked={isUnsubscribing} handleToggle={setIsUnsubscribing} />
        </div>


        <h2>{selectedGameShow}</h2>
        {
            isUnsubscribing ?
                <p>By unsubscribing, you no longer receive Emails regarding {selectedGameShow}.</p> :
                <p>By subscribing, you will get E-mails when a new concurrent-player record is broken for {selectedGameShow}. </p>
        }

        {
            !isUnsubscribing &&
            <div style={{ display: "flex" }}>
                <p>I agree that Evotracker store my email <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} /></p>
            </div>
        }
        <div>E-mail</div>

        <div>
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
            {
                isUnsubscribing ?
                    <button onClick={() => validateAndSubmitUnsubscription(email)}>Unsubscribe</button>
                    : <button onClick={() => validateAndSubmitSubscription(email)}>Subscribe</button>

            }
        </div>
        {isPosting && <img className={styles.spinner} src="spinner.png" width="50px"></img>}
        {validationError && <p style={{ padding: "10px", backgroundColor: "pink", color: "#1b2631" }}>{validationError}</p>}
    </Modal>
};

