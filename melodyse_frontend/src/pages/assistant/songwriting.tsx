import Head from "next/head";
import styles from "@/styles/Songwriting.module.scss";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import AIActionButton from "@/components/AIActionButton/AIActionButton";
import UndoButton from "@/components/UndoButton/UndoButton";
const diff = require("diff");

function Songwriting({ subscriptions = [] }) {
  const [lyrics, setLyrics] = useState("");
  const [useInterests, setUseInterests] = useState(true);
  const [undoEnabled, setUndoEnabled] = useState(false);
  const [redoEnabled, setRedoEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbackBox, setFeedbackBox] = useState(false);
  const [feedbackText, setFeedbackText] = useState();
  const [tempLyrics, setTempLyrics] = useState();
  const [differences, setDifferences] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const historyRef = useRef({ past: [], present: lyrics, future: [] });

  useEffect(() => {
    differences.length > 0 ? setDisabled(true) : setDisabled(false);
  }, [differences]);

  useEffect(() => {
    const { past, present, future } = historyRef.current;
    past.length > 0 ? setUndoEnabled(true) : setUndoEnabled(false);
    future.length > 0 ? setRedoEnabled(true) : setRedoEnabled(false);
  }, [historyRef.current]);

  function handleUndo() {
    const { past, present, future } = historyRef.current;
    if (past.length > 0) {
      const previous = past[past.length - 1];
      historyRef.current = {
        past: past.slice(0, past.length - 1),
        present: previous,
        future: [present, ...future],
      };
      setLyrics(previous);
    }
  }

  function handleRedo() {
    const { past, present, future } = historyRef.current;
    if (future.length > 0) {
      const next = future[0];
      historyRef.current = {
        past: [...past, present],
        present: next,
        future: future.slice(1),
      };
      setLyrics(next);
    }
  }

  function handleChange(value) {
    const { past, present, future } = historyRef.current;
    historyRef.current = {
      past:
        past.length > 14
          ? [...historyRef.current.past.slice(1), historyRef.current.present]
          : [...historyRef.current.past, historyRef.current.present],
      present: value,
      future: [],
    };
    setLyrics(value);
  }

  const feedback = () => {
    if (lyrics.length > 0) {
      setLoading(true);
      setDisabled(true);
      const data = new FormData();
      data.append("lyrics", lyrics);
      data.append("with_interests", useInterests.toString());
      axios
        .post(`${process.env.SITE_URL}/feedback`, data, {
          withCredentials: true,
        })
        .then((res) => {
          setLoading(false);
          const cleanText = res.data.choices[0].text.replace(/^\s+/, "");
          setFeedbackText(cleanText);
          setDisabled(false);
          setFeedbackBox(true);
        })
        .catch((err) => {
          setDisabled(false);
          setLoading(false);
          console.error(err);
        });
    }
  };

  const fixGrammar = () => {
    if (lyrics.length > 0) {
      setLoading(true);
      setDisabled(true);
      const data = new FormData();
      data.append("lyrics", lyrics);
      data.append("with_interests", useInterests.toString());
      axios
        .post(`${process.env.SITE_URL}/grammar`, data, {
          withCredentials: true,
        })
        .then((res) => {
          setLoading(false);
          const cleanText = res.data.choices[0].text.replace(/^\s+/, "");
          const difs = diff.diffWords(lyrics, cleanText);
          setTempLyrics(cleanText);
          setDisabled(false);
          setDifferences(difs);
        })
        .catch((err) => {
          setDisabled(false);
          setLoading(false);
          console.error(err);
        });
    }
  };

  const improveLyrics = () => {
    if (lyrics.length > 0) {
      setLoading(true);
      setDisabled(true);
      const data = new FormData();
      data.append("lyrics", lyrics);
      data.append("with_interests", useInterests.toString());
      axios
        .post(`${process.env.SITE_URL}/improve`, data, {
          withCredentials: true,
        })
        .then((res) => {
          setLoading(false);
          const cleanText = res.data.choices[0].text.replace(/^\s+/, "");
          const difs = diff.diffWords(lyrics, cleanText);
          setTempLyrics(cleanText);
          setDifferences(difs);
          setDisabled(false);
        })
        .catch((err) => {
          setDisabled(false);
          setLoading(false);
          console.error(err);
        });
    }
  };

  const generate = () => {
    setLoading(true);
    setDisabled(true);
    const data = new FormData();
    data.append("lyrics", lyrics);
    data.append("with_interests", useInterests.toString());
    axios
      .post(`${process.env.SITE_URL}/generate`, data, {
        withCredentials: true,
      })
      .then((res) => {
        setLoading(false);
        const cleanText = res.data.choices[0].text.replace(/^\s+/, "");
        setDisabled(false);
        setLyrics(cleanText);
      })
      .catch((err) => {
        setDisabled(false);
        setLoading(false);
        console.error(err);
      });
  };

  const generateMelody = () => {
    if (lyrics.length > 0) {
      setLoading(true);
      setDisabled(true);
      const data = new FormData();
      data.append("lyrics", lyrics);
      data.append("with_interests", useInterests.toString());
      axios
        .post(`${process.env.SITE_URL}/generatemelody`, data, {
          withCredentials: true,
        })
        .then((res) => {
          setLoading(false);
          const cleanText = res.data.choices[0].text.replace(/^\s+/, "");
          setFeedbackText(cleanText);
          setDisabled(false);
          setFeedbackBox(true);
        })
        .catch((err) => {
          setDisabled(false);
          setLoading(false);
          console.error(err);
        });
    }
  };

  const accept = () => {
    setLyrics(tempLyrics);
    const { past, present, future } = historyRef.current;
    historyRef.current = {
      past:
        past.length > 14
          ? [...historyRef.current.past.slice(1), historyRef.current.present]
          : [...historyRef.current.past, historyRef.current.present],
      present: tempLyrics,
      future: [],
    };
    setDifferences([]);
    setTempLyrics();
  };

  return (
    <>
      <Head>
        <title>Songwriting Assistant | MELODYSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <h1>SONGWRITING ASSISTANT</h1>
          {differences.length > 0 && (
            <div className={styles.actions}>
              <button className={styles.accept} onClick={() => accept()}>
                <img src={"/icons/check.png"} />
                Accept Changes
              </button>
              <button
                className={styles.reject}
                onClick={() => setDifferences([])}
              >
                <img src={"/icons/x.png"} />
                Reject
              </button>
            </div>
          )}
          <div className={styles.lyricsContainer}>
            {differences.length == 0 && (
              <textarea
                className={feedbackBox && styles.textMinimized}
                placeholder="Write down your lyrics..."
                value={lyrics}
                onChange={(e) => handleChange(e.target.value)}
              ></textarea>
            )}

            {differences.length > 0 && (
              <div
                style={{ whiteSpace: "pre-wrap" }}
                className={styles.diffDiv}
              >
                {differences.map((part) =>
                  part.added ? (
                    <span className={styles.lyricGreen}>{part.value}</span>
                  ) : part.removed ? (
                    <span className={styles.lyricRed}>{part.value}</span>
                  ) : (
                    <span className={styles.lyricNeutral}>{part.value}</span>
                  )
                )}
              </div>
            )}

            <div
              className={loading ? styles.loadingOverlay : styles.loadingHidden}
            >
              <img src="/loading-melodyse.gif" />
            </div>
            <div
              style={{ whiteSpace: "pre-wrap" }}
              className={
                feedbackBox ? styles.feedbackOpen : styles.feedbackClosed
              }
            >
              {feedbackText}
              <div
                className={styles.close}
                onClick={() => setFeedbackBox(false)}
              >
                <img src="/icons/close.png" />
              </div>
            </div>
          </div>
          <div className={styles.belowText}>
            <AIActionButton
              name="Help with Melody"
              pic="/assistant/music.png"
              submit={generateMelody}
              disabled={disabled}
            />

            <div className={styles.useInterests}>
              <label>Use my interests to improve responses</label>
              <input
                type="checkbox"
                checked={useInterests}
                onChange={() => setUseInterests(!useInterests)}
              />
            </div>
          </div>
        </div>
        <div className={styles.rightSide}>
          <div className={styles.undobuttons}>
            <UndoButton type="undo" enabled={undoEnabled} undo={handleUndo} />
            <UndoButton type="redo" enabled={redoEnabled} redo={handleRedo} />
          </div>

          <AIActionButton
            name="Improve Lyrics"
            pic="/assistant/composing.png"
            subscription={subscriptions.find((sub) => sub.level == 1)}
            submit={improveLyrics}
            disabled={disabled}
          />

          <AIActionButton
            name="Feedback"
            pic="/assistant/feedback.png"
            submit={feedback}
            disabled={disabled}
          />

          <AIActionButton
            name="Fix Grammar"
            pic="/assistant/grammar.png"
            submit={fixGrammar}
            disabled={disabled}
          />

          <AIActionButton
            name="Generate New Lyrics"
            pic="/assistant/magic-wand.png"
            submit={generate}
            disabled={disabled}
          />

          <img className={styles.aiImage} src="/icons/writing.png" />
        </div>
      </div>
    </>
  );
}

Songwriting.getInitialProps = async (ctx) => {
  let data = [];
  await axios
    .get(`${process.env.SERVER_SITE_URL}/getsubscriptions`)
    .then((res) => {
      data = res.data;
    })
    .catch((err) => console.error(err));
  return { subscriptions: data };
};

export default Songwriting;
