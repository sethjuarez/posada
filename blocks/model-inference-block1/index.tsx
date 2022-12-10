import { useState, useEffect, useRef } from "react";
import { FileBlockProps } from "@githubnext/blocks";
import {
  Box,
  Text,
  Token,
  Heading,
  Pagehead,
  IssueLabelToken,
} from "@primer/react";
import { Video, VideoRef } from "./video";
import Device from "./device";
import "./index.css";

interface Scores {
  none: number;
  paper: number;
  rock: number;
  scissors: number;
}

interface Prediction {
  time: number;
  prediction: string;
  scores: Scores;
  timestamp: string;
  model_update: string;
  message: string;
}

export default function (props: FileBlockProps) {
  const { context, content, metadata, onUpdateMetadata } = props;
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoId, setVideoId] = useState<string>("");
  const [settings, setSettings] = useState<MediaTrackSettings>({});
  const [frame, setFrame] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const videoRef = useRef<VideoRef>(null);

  useEffect(() => {
    (async () => {
      if (navigator.mediaDevices) {
        const items = await navigator.mediaDevices.enumerateDevices();
        setDevices(items.filter((device) => device.kind === "videoinput"));
        if (devices && devices.length > 0) {
          setVideoId(devices[0].deviceId);
        }
      }
    })();
  }, []);

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === " ") {
      getFrame();
    }
  };

  useEffect(() => {
    document.body.addEventListener("keyup", handleKey);
    return () => {
      document.body.removeEventListener("keyup", handleKey);
    };
  }, []);

  const getFrame = async () => {
    if (videoRef.current) {
      const frame = videoRef.current?.getFrame();
      if (frame) {
        setFrame(frame);
        // prediction here
        /*
          const options: RequestInit = {
            method: "POST",
            body: JSON.stringify({ image: frame }),
            mode: "no-cors",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${inferencekey}`,
            },
          };
          const response = await fetch(inferenceurl, options);
          const pred: Prediction = await response.json();
          setPrediction(pred);
        */

        setPrediction({
          time: 0.081216,
          prediction: "rock",
          scores: {
            none: 0.07033271342515945,
            paper: 0.040327128022909164,
            rock: 0.78826504945755,
            scissors: 0.10107509791851044,
          },
          timestamp: "2022-11-19T00:52:16.576707",
          model_update: "2022-11-18T00:16:18.955318",
          message: "Success!",
        });
      }
    }
  };

  return (
    <Box p={3}>
      <Box>
        <Pagehead>
          <Heading>Roshambo Model</Heading>
          <Text>Select a camera and hit the space bar to try it out!</Text>
        </Pagehead>
      </Box>
      <Box display="grid" gridTemplateColumns="2fr 1fr" gridGap={2}>
        <Box p={0}>
          <Device onSelect={setVideoId} devices={devices} />
        </Box>
        <Box p={3}></Box>
      </Box>
      <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gridGap={3} mt={3}>
        <Box
          p={3}
          borderColor="border.default"
          borderWidth={1}
          borderStyle="solid"
          onClick={getFrame}
        >
          <Video
            className="fill"
            device={videoId}
            onVideoSet={setSettings}
            ref={videoRef}
          />
        </Box>
        <Box
          p={3}
          borderColor="border.default"
          borderWidth={1}
          borderStyle="solid"
        >
          {frame && <img alt="current" className="fill" src={frame} />}
        </Box>
        <Box p={3} pt={0}>
          {prediction && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <Text
                  sx={{
                    fontWeight: "bold",
                    display: "block",
                    color: "fg.muted",
                  }}
                >
                  Prediction
                </Text>
                <Box
                  display="flex"
                  sx={{
                    alignItems: "start",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <IssueLabelToken
                    fillColor="#0366d6"
                    size="xlarge"
                    text={prediction.prediction}
                  />
                </Box>
              </Box>
              <Box
                role="separator"
                sx={{
                  width: "100%",
                  height: 1,
                  backgroundColor: "border.default",
                }}
              ></Box>
              <Box>
                <Text
                  sx={{
                    fontWeight: "bold",
                    display: "block",
                    color: "fg.muted",
                  }}
                >
                  Labels
                </Text>
                <Box
                  display="flex"
                  sx={{
                    alignItems: "start",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Token
                    size="xlarge"
                    text={`Rock: ${(prediction.scores.rock * 100).toFixed(2)}%`}
                  />
                  <Token
                    size="xlarge"
                    text={`Paper: ${(prediction.scores.paper * 100).toFixed(2)}%`}
                  />
                  <Token
                    size="xlarge"
                    text={`Scissors: ${(prediction.scores.scissors * 100).toFixed(2)}%`}
                  />
                  <Token
                    size="xlarge"
                    text={`None: ${(prediction.scores.none * 100).toFixed(2)}%`}
                  />

                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
