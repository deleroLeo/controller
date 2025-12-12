"use client"

import React from 'react'
import { useCallback, useState,useEffect, useRef } from "react";


const VidPlayer = ({url, setSavedImage}) => {

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const webrtcSendChannel = useRef(null);
  const peerConnection = useRef(null);
  const remoteStream = useRef(null);
  const canvasRef = useRef(null);

  const CamCapture = () =>{
    const video = remoteVideoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL("image/png"); // Base64
    setSavedImage(dataURL);

  }

  useEffect(() => {
      peerConnection.current = new RTCPeerConnection({
      iceServers: [{
        urls: ['stun:stun.l.google.com:19302']
      }],
      sdpSemantics: 'unified-plan'})

      remoteStream.current = new MediaStream();
      remoteVideoRef.current.srcObject = remoteStream.current;

      peerConnection.current.ontrack = (event) => {
        remoteStream.current.addTrack(event.track)
        console.log(event.streams.length + ' track is delivered')};

      peerConnection.current.oniceconnectionstatechange = () => {
        console.log("ICE state:", peerConnection.current.iceConnectionState);
      };
      peerConnection.current.onicecandidateerror = console.error;
      
    
      peerConnection.current.addTransceiver('video', { direction: 'recvonly' })
      peerConnection.current.addTransceiver('audio', {direction: 'recvonly'})
      peerConnection.current.onnegotiationneeded = async function handleNegotiationNeeded () {
        const offer = await peerConnection.current.createOffer()

        await peerConnection.current.setLocalDescription(offer)

        fetch(url, {
          method: 'POST',
          body: new URLSearchParams({ data: btoa(peerConnection.current.localDescription.sdp) })
        })
          .then(response => response.text())
          .then(data => {
            try {
              peerConnection.current.setRemoteDescription(
                new RTCSessionDescription({ type: 'answer', sdp: atob(data) })
              )
            } catch (e) {
              console.warn(e)
            }
          })
      }

    webrtcSendChannel.current = peerConnection.current.createDataChannel('rtsptowebSendChannel')
    webrtcSendChannel.current.onopen = (event) => {
      console.log(`${webrtcSendChannel.current.label} has opened`)
      webrtcSendChannel.current.send('ping')
    }
    webrtcSendChannel.current.onclose = (_event) => {
      console.log(`${webrtcSendChannel.current.label} has closed`)
      //VidPlayer(url)
    }
    webrtcSendChannel.current.onmessage = event => console.log(event.data)

   }, [url]);
   return (
    <div>
        <button onClick = {CamCapture}>Bild Aufnehmen</button>
        <video  ref = {remoteVideoRef} autoPlay controls playsInline muted style={{width: '100%', height: 'auto'}}/>
      
    </div>
   )
    
  }

const VidSettings = ({getSettings, setCam}) => {
  const [cams, setCams] = useState([]);
  const [selectCam, setSelectCam] = useState("");

  const getCams = async() => {
      const tempSettings = await getSettings('cams-load');
      console.log("The cams we want to see:",tempSettings)
      setCams(tempSettings);
    }
  useEffect(()=>{
    getCams();
  },[])
  return(
    <div>
      <div>Cam Auswählen:</div>
      <select name="rooms" id="rooms" defaultValue = "hidden" onChange={(e) => setSelectCam(e.target.value)}>
            <option disabled={true} value="hidden">Kamera wählen</option>
            {cams.map(({name}) =>
            <option key = {name} value={name} >{name}</option>
            )}
            </select>
            <button onClick={()=>setCam(cams.find((cam) => cam.name == selectCam))}>Cam Auswählen</button>
      
    </div>
  )
}

const VidSection = ({getSettings, setSavedImage}) => {
  const [cam, setCam] = useState({type:null});

  useEffect(()=>{
    console.log(cam)
  },[cam])
  
  if (cam.type==="rtsp"){
    return(
      <div>
      <VidSettings setCam = {setCam} getSettings = {getSettings}/>
      <div className="flex h-full flex-col items-center justify-center">
        
          <VidPlayer url = {cam.url} setSavedImage = {setSavedImage}/>
        
      </div>
      </div>
    )}
  if (cam.type ==="http"){
    return(
      <div>
      <VidSettings setCam = {setCam} getSettings = {getSettings}/>
      <div className="flex h-full flex-col items-center justify-center">
        
          <video src={cam.url} crossOrigin="anonymous"></video>
        
      </div>
      </div>
    )
  }
  return(<div>
    <VidSettings setCam = {setCam} getSettings = {getSettings}/>

    
    </div>)
  
}

export default VidSection
//export default VidPlayer




