"use client"

import React from 'react'
import { useCallback, useEffect, useRef } from "react";


const VidPlayer = ({url}) => {

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const webrtcSendChannel = useRef(null);
  const peerConnection = useRef(null);

  useEffect(() => {
      peerConnection.current = new RTCPeerConnection({
      iceServers: [{
        urls: ['stun:stun.l.google.com:19302']
      }],
      sdpSemantics: 'unified-plan'})

      peerConnection.current.ontrack = event => {
        remoteVideoRef.current.srcObject = event.streams[0]
        console.log(event.streams.length + ' track is delivered')};
      
    
      peerConnection.current.addTransceiver('video', { direction: 'sendrecv' })
      peerConnection.current.addTransceiver('audio', {direction: 'sendrecv'})
      peerConnection.current.onnegotiationneeded = async function handleNegotiationNeeded () {
        const offer = await peerConnection.current.createOffer()

        await peerConnection.current.setLocalDescription(offer)

        fetch(url, {
          method: 'POST',
          body: new URLSearchParams({ data: btoa(webrtc.localDescription.sdp) })
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
      VidPlayer(url)
    }
    webrtcSendChannel.current.onmessage = event => console.log(event.data)

   }, []);
   return (
    <div>
      
        <video  ref = {remoteVideoRef} autoplay controls style={{width: '100%', height: 'auto'}}/>
      
    </div>
   )
    
  }


const VidSection = ({urls}) => {
    return(
      <div className="flex h-full flex-col items-center justify-center">
        {urls.map((url) => 
          <VidPlayer url = {url}/>
        )}
      </div>
    )
}

export default VidSection




