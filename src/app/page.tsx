"use client";

import React, { useState, useEffect, useRef } from "react";

//components bootstrap
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

//TensorFlow
import * as tf from "@tensorflow/tfjs";
import * as qna from "@tensorflow-models/qna"; //BERT


export default function Home() {
  const passageRef = useRef<any>(null);
  const questionRef = useRef<any>(null);

  const [answer, setAnswer] = useState<any>([]);
  const [model, setModel] = useState<any>(null);

  //Load TensorFlow Model
  const loadModel = async () => {
    await tf.getBackend();
    const loadedModel = await qna.load();
    setModel(loadedModel);
    console.log("Model");
  };

  useEffect(() => {
    loadModel();
  }, []);

  const handleClick = async (e: any) => {
    if (e.which === 13 && model !== null) console.log("Question submitted");
    const passage = passageRef.current.value;
    const question = questionRef.current.value;

    const answer = await model.findAnswers(question, passage);
    setAnswer(answer);
    console.log(answer);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full h-full">
        {false === null ? ( //Has our model loaded
          <div>
            <div>Model Loading</div>
          </div>
        ) : (
          <>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Passage</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={30}
                  cols={20}
                  ref={passageRef}
                />
              </Form.Group>
              <Form.Group
                className="mb-3 flex flex-row w-100 "
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Ask a Question</Form.Label>
                <Form.Control type="text" ref={questionRef} />
                <Button variant="primary" onClick={handleClick}>
                  Answer
                </Button>
              </Form.Group>
            </Form>
            {answer
              ? answer?.map((ans: any, index: any) => (
                  <div key={index}>
                    <b>Answer {index + 1} - </b>
                    {ans.text} {ans.core}
                  </div>
                ))
              : ""}
          </>
        )}
      </div>
    </main>
  );
}
