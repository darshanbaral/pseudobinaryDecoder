import "./index.css";
import { useEffect, useState } from "react";
import {
  decode_pseudobinary,
  decode_pseudobinary_b,
  decode_signed_pseudobinary,
} from "./utils/decodeFuncs.js";

function App() {
  useEffect(() => decode(), []);

  const [mainOption, setMainOption] = useState("custom");
  const handleMainOptionChange = (e) => {
    setMainOption(e.target.value);
  };

  const [messageFormat, setMessageFormat] = useState("pb_positive");
  const handleMessageFormatChange = (e) => {
    setMessageFormat(e.target.value);
  };

  useEffect(() => {
    const setFormOptions = () => {
      switch (mainOption) {
        case "sutron_voltage":
          setStart(messageLength - 1);
          setWidth(1);
          setEnd(messageLength);
          setDivider(1);
          setMultiplier(0.234);
          setAdder(10.6);
          break;
        case "da_voltage":
          setStart(messageLength - 1);
          setWidth(1);
          setEnd(messageLength);
          setDivider(1);
          setMultiplier(0.3124);
          setAdder(0.311);
      }
    };
    setFormOptions();
  }, [mainOption]);

  let defaultMessage = "`BST@Ff@Ffj";
  const [message, setMessage] = useState(defaultMessage);
  const handleMessageChange = (e) => {
    let newMessage = e.target.value.replace(/ /g, "");
    if (newMessage === "") {
      e.target.setCustomValidity("Message cannot be empty");
    } else {
      e.target.setCustomValidity("");
    }
    setMessage(newMessage);
    setMessageLength(newMessage.length);
  };

  let defaultStartIndex = 4;
  const [start, setStart] = useState(defaultStartIndex);
  const handleStartChange = (e) => {
    let startIndex = e.target.value;
    let formattedStartIndex = Number(startIndex);
    if (width === "") {
      setStart(formattedStartIndex);
      return;
    }
    if (startIndex === "" || width === "") {
      setStart("");
      setEnd("N/A");
      e.target.setCustomValidity("Start index of sub-message cannot be empty");
    } else {
      setStart(formattedStartIndex);
      setEnd(width + formattedStartIndex);
      e.target.setCustomValidity("");
    }
  };

  let defaultWidth = 3;
  const [width, setWidth] = useState(defaultWidth);
  const [end, setEnd] = useState(defaultStartIndex + defaultWidth);
  const handleWidthChange = (e) => {
    let widthValue = e.target.value;
    let formattedWidth = Number(widthValue);
    if (widthValue === "") {
      setWidth("");
      setEnd("N/A");
      e.target.setCustomValidity("Message width cannot be empty");
    } else {
      setWidth(formattedWidth);
      setEnd(formattedWidth + start);
      e.target.setCustomValidity("");
    }
  };

  let defaultDivider = 100;
  const [divider, setDivider] = useState(defaultDivider);
  const handleDividerChange = (e) => {
    let dividerValue = e.target.value;
    let formattedDividerValue = Number(dividerValue);

    if (dividerValue === "") {
      setDivider("");
      e.target.setCustomValidity("Divider cannot be empty");
    } else {
      setDivider(formattedDividerValue);
      if (formattedDividerValue === 0) {
        e.target.setCustomValidity("Divider cannot be zero");
      } else {
        e.target.setCustomValidity("");
      }
    }
  };

  let defaultMultiplier = 1;
  const [multiplier, setMultiplier] = useState(defaultMultiplier);
  const handleMultiplierChange = (e) => {
    let multiplierValue = e.target.value;
    let formattedMultiplierValue = Number(multiplierValue);
    if (multiplierValue === "") {
      setMultiplier("");
      e.target.setCustomValidity("Multiplier cannot be empty");
    } else {
      setMultiplier(formattedMultiplierValue);
      e.target.setCustomValidity("");
    }
  };

  let defaultAdder = 0;
  const [adder, setAdder] = useState(defaultAdder);
  const handleAdderChange = (e) => {
    let adderValue = e.target.value;
    let formattedAdderValue = Number(adderValue);
    if (adderValue === "") {
      setAdder("");
      e.target.setCustomValidity("Adder cannot be empty");
    } else {
      setAdder(formattedAdderValue);
      e.target.setCustomValidity("");
    }
  };

  let defaultNDigits = 2;
  const [nDigits, setNDigits] = useState(defaultNDigits);
  const handleNDigitsChange = (e) => {
    let nDigitsValue = e.target.value;
    let formattedNDigits = Number(nDigitsValue);
    if (nDigitsValue === "") {
      setNDigits("");
      e.target.setCustomValidity("Number of digits cannot be empty");
    } else {
      setNDigits(formattedNDigits);
      e.target.setCustomValidity("");
    }
  };

  let defaultSubMessage = defaultMessage.slice(start, end);
  const [subMessage, setSubMessage] = useState(defaultSubMessage);

  const [messageLength, setMessageLength] = useState(message.length);

  const [decodedData, setDecodedData] = useState(null);
  const [processedValue, setProcessedValue] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (e.target.checkValidity()) {
      decode();
    } else {
      e.target.reportValidity();
    }
  };

  const formatSubMessage = () => {
    let prefix = message.slice(0, start);
    let middle = message.slice(start, end);
    let suffix = message.slice(end, messageLength);
    return (
      <>
        <span className={"text-gray-500"}>{prefix}</span>
        <span className={"text-green-500"}>{middle}</span>
        <span className={"text-gray-500"}>{suffix}</span>
      </>
    );
  };

  const decode = () => {
    let newSubMessage = message.slice(start, end);
    let formattedSubMessage = formatSubMessage();
    setSubMessage(formattedSubMessage);

    let decodedValue;
    switch (messageFormat) {
      case "pb_positive":
        decodedValue = decode_pseudobinary(newSubMessage);
        break;
      case "pb_signed":
        decodedValue = decode_signed_pseudobinary(newSubMessage);
        break;
      case "pb_b":
        decodedValue = decode_pseudobinary_b(newSubMessage);
    }
    let processedData = processData(decodedValue);
    setDecodedData(decodedValue);
    setProcessedValue(processedData);
  };

  const processData = (decodedValue) => {
    let processedValue = (decodedValue * multiplier) / divider + adder;
    return processedValue.toFixed(nDigits);
  };

  return (
    <>
      <h1>Pseudo-binary Decoder</h1>
      <p>
        The index begins at <code>0</code>.
      </p>

      <hr />

      <form onSubmit={handleSubmit} name="msg_data">
        <div>
          <div className="flex flex-col w-sm-input">
            <label htmlFor="e_msg">Encoded Message</label>
            <input
              type="text"
              id="e_msg"
              value={message}
              onChange={handleMessageChange}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="flex mb-1 justify-between">
          <div className="flex flex-col w-1/3 mr-2">
            <label htmlFor="msg_width">Width</label>
            <input
              className={"w-full"}
              type="number"
              id="msg_width"
              value={width.toString()}
              onChange={handleWidthChange}
              min={1}
              max={3}
            />
          </div>
          <div className="flex flex-col w-1/3 mx-2">
            <label htmlFor="msg_start">Start</label>
            <input
              className={"w-full"}
              type="number"
              id="msg_start"
              value={start.toString()}
              onChange={handleStartChange}
              min="0"
              max={messageLength - width}
            />
          </div>
          <div className="flex flex-col w-1/3 ml-2">
            <label htmlFor="msg_end">End</label>
            <input
              className="border-gray-600 text-gray-400 w-full"
              type="text"
              value={end}
              id="msg_end"
              disabled
            />
          </div>
        </div>

        <div className="flex mb-1 justify-between">
          <div className="flex flex-col w-1/2 mr-2">
            <label htmlFor="div">Divider</label>
            <input
              className={"w-full"}
              type="number"
              value={divider.toString()}
              step="any"
              id="div"
              onChange={handleDividerChange}
            />
          </div>
          <div className="flex flex-col w-1/2 ml-2">
            <label htmlFor="mul">Multiplier</label>
            <input
              className={"w-full"}
              type="number"
              id="mul"
              value={multiplier.toString()}
              step="any"
              onChange={handleMultiplierChange}
            />
          </div>
        </div>

        <div className="flex mb-1 justify-between">
          <div className="flex flex-col w-1/2 mr-2">
            <label htmlFor="add">Adder</label>
            <input
              className={"w-full"}
              type="number"
              value={adder.toString()}
              step="any"
              id="add"
              onChange={handleAdderChange}
            />
          </div>
          <div className="flex flex-col w-1/2 ml-2">
            <label htmlFor="ndig">Digits</label>
            <input
              className={"w-full"}
              type="number"
              value={nDigits.toString()}
              id="ndig"
              min="0"
              onChange={handleNDigitsChange}
            />
          </div>
        </div>
        <hr className={"border-gray-600"} />
        <div className={"flex items-center"}>
          <div className={"flex flex-col w-1/2 mr-2"}>
            <label htmlFor="main-option">Type of Message</label>
            <select
              name="main-option"
              id="main-option"
              onChange={handleMainOptionChange}
            >
              <option value="custom">Custom</option>
              <option value="sutron_voltage">Sutron Voltage</option>
              <option value="da_voltage">DA Voltage</option>
            </select>
          </div>

          <div className={"flex flex-col w-1/2 ml-2"}>
            <label htmlFor="message-format">Message Format</label>
            <select
              name="message-format"
              id="message-format"
              onChange={handleMessageFormatChange}
            >
              <option value="pb_positive">Non-negative</option>
              <option value="pb_signed">Signed</option>
              <option value="pb_b">Pseudo-binary B</option>
            </select>
          </div>
        </div>
        <button className={"my-3 w-full"} type="submit">
          Decode
        </button>
      </form>

      <section
        id="results"
        className={"bg-gray-800 p-2 rounded mb-2 border border-gray-400"}
      >
        <h2>Results</h2>
        <p>
          Raw Encoded Message: <code>{subMessage}</code>
        </p>
        <p>
          Decoded Data: <code>{decodedData}</code>
        </p>
        <p>
          Processed Data: <code>{processedValue}</code>
        </p>
      </section>
    </>
  );
}

export default App;
