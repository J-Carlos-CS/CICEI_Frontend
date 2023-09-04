//import React, { useState, useRef, useEffect, useCallback } from "react";
import { Row, Col, Button } from "antd";
//import streamSaver from 'streamsaver'

/* const MyOtherComponent = React.memo(({ num, mem, setCount,b }) => {
  //const [mycounter, setMycounter] = useState(counter*2);
  useEffect(() => {
    console.log("algo");
  }, []);
  console.log("I rendered");
}); */

export default function ComponentTest() {
  /* const [count, setCount] = useState(1);
  const [Objectsito, setObjectsito] = useState({a:1,b:2});
  const [secondCount, setSecondCount] = useState(0);
  const e = 1;
  const mem = useCallback(() => {
    console.log("otra cosa", secondCount);
  }, [secondCount]);
  console.log("I render", count);
  const handleClick = () => {
    setCount(count + 1);
    setObjectsito({...Objectsito,a:Objectsito.a+1});
  }; */

  const fetchdownload = async() => {
    fetch(`http://localhost:4000/api/user/about`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      },
      body: null
  })
  .then(async (response)=>{
    let resp = await response.json();
    console.log('response',resp);
  }).catch((e)=>{

  });
  }
  return (
    <Row align="center">
      {/* <Col span={12}>
        <Button onClick={handleClick}>Click</Button>
      </Col>
      <Col span={12}>{count}</Col>
      <Col span={12}>
        <Button onClick={()=>{setSecondCount(secondCount+1)}}>Click second</Button>
      </Col>
      <Col span={12}>{secondCount}</Col>
      <MyOtherComponent num={e} mem={mem} setCount={setCount} b={Objectsito.b}/> */}
      <Col span={24}>
        <Button onClick={()=>{fetchdownload()}}>Hola mundo</Button>
      </Col>
    </Row>
  );
}
