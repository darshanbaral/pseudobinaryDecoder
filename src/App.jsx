import "./index.css";
import { useEffect, useState } from "react";
import {
  decode_pseudobinary,
  decode_pseudobinary_b,
  decode_signed_pseudobinary,
} from "./utils/decodeFuncs.js";

const defaultConfig = {
  message: "`BST@Ff@Ffj",
  start: 4,
  width: 3,
  divider: 100,
  multiplier: 1,
  adder: 0,
  nDigits: 2,
  messageFormat: "pb_positive",
  mainOption: "custom",
};

const presets = {
  sutron_voltage: {
    startOffset: -1,
    width: 1,
    divider: 1,
    multiplier: 0.234,
    adder: 10.6,
  },
  da_voltage: {
    startOffset: -1,
    width: 1,
    divider: 1,
    multiplier: 0.3124,
    adder: 0.311,
  },
};

export default function App() {


  const [mainOption, setMainOption] = useState(defaultConfig.mainOption);
  const handleMainOptionChange = (e) => {
    setMainOption(e.target.value);
  };

  const [messageFormat, setMessageFormat] = useState(
    defaultConfig.messageFormat
  );
  const handleMessageFormatChange = (e) => {
    setMessageFormat(e.target.value);
  };

  const [message, setMessage] = useState(defaultConfig.message);
  const [start, setStart] = useState(defaultConfig.start);
  const [width, setWidth] = useState(defaultConfig.width);
  const [end, setEnd] = useState(defaultConfig.start + defaultConfig.width);
  const [divider, setDivider] = useState(defaultConfig.divider);
  const [multiplier, setMultiplier] = useState(defaultConfig.multiplier);
  const [adder, setAdder] = useState(defaultConfig.adder);
  const [nDigits, setNDigits] = useState(defaultConfig.nDigits);
  const [messageLength, setMessageLength] = useState(message.length);

  let defaultSubMessage = defaultConfig.message.slice(start, end);
  const [subMessage, setSubMessage] = useState(defaultSubMessage);

  const [decodedData, setDecodedData] = useState(null);
  const [processedValue, setProcessedValue] = useState(null);

  useEffect(() => {
    if (mainOption === "custom") return;

    const preset = presets[mainOption];
    const newStart = message.length + preset.startOffset;
    setStart(newStart);
    setWidth(preset.width);
    setEnd(newStart + preset.width);
    setDivider(preset.divider);
    setMultiplier(preset.multiplier);
    setAdder(preset.adder);
  }, [mainOption]);

  useEffect(() => decode(), []);

  const checkValidity = (name, value) => {
    if (value === "") {
      return `${name} cannot be empty`;
    }
    return "";
  };

  const handleChange = (e, name) => {
    let value = e.target.value;

    switch (name) {
      case "Divider":
        setDivider(value);
        if (value === "0") {
          e.target.setCustomValidity("Divider cannot be zero");
          return;
        }
        break;
      case "Message":
        setMessage(value);
        break;
      case "Width":
        setWidth(value);
        break;
      case "Start":
        setStart(value);
        break;
      case "Multiplier":
        setMultiplier(value);
        break;
      case "Adder":
        setAdder(value);
        break;
      case "Digits":
        setNDigits(value);
        break;
    }
    e.target.setCustomValidity(checkValidity(name, value));
  };

  useEffect(() => {
    if (width === "" || start === "") {
      setEnd("N/A");
    } else {
      setEnd(Number(start) + Number(width));
    }
  }, [start, width]);

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
    let processedValue =
      (decodedValue * Number(multiplier)) / Number(divider) + Number(adder);
    return processedValue.toFixed(Number(nDigits));
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
          <div className="flex flex-col w-sm-input mb-2">
            <label htmlFor="e_msg">Encoded Message</label>
            <textarea
              className={"border rounded bg-gray-800 p-1"}
              rows="3"
              id="e_msg"
              value={message}
              onChange={(e) => handleChange(e, "Message")}
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
              onChange={(e) => handleChange(e, "Width")}
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
              onChange={(e) => handleChange(e, "Start")}
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
              className={"w-full no-spinner"}
              type="number"
              value={divider.toString()}
              step="any"
              id="div"
              onChange={(e) => handleChange(e, "Divider")}
            />
          </div>

          <div className="flex flex-col w-1/2 mx-2">
            <label htmlFor="mul">Multiplier</label>
            <input
              className={"w-full no-spinner"}
              type="number"
              id="mul"
              value={multiplier.toString()}
              step="any"
              onChange={(e) => handleChange(e, "Multiplier")}
            />
          </div>

          <div className="flex flex-col w-1/2 mx-2">
            <label htmlFor="add">Adder</label>
            <input
              className={"w-full no-spinner"}
              type="number"
              value={adder.toString()}
              step="any"
              id="add"
              onChange={(e) => handleChange(e, "Adder")}
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
              onChange={(e) => handleChange(e, "Digits")}
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
        className={"bg-gray-800 p-2 rounded-sm mb-2 border"}
      >
        <h2>Results</h2>
        <p>
          <span className={"font-bold"}>Raw Encoded Message</span>:{" "}
          <code>{subMessage}</code>
        </p>

        <p>
          <span className={"font-bold"}>Decoded Data</span>:{" "}
          <code>{decodedData}</code>
        </p>

        <p>
          <span className={"font-bold"}>Processed Data</span>:{" "}
          <code>{processedValue}</code>
        </p>
      </section>
    </>
  );
}
