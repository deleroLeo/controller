"use client"

import React from 'react'
import { useCallback, useEffect, useState } from "react";


const VidPlayer = ({url}) => {
  useEffect(() => {
      const webrtc = new RTCPeerConnection({
      iceServers: [{
        urls: ['stun:stun.l.google.com:19302']
      }],
      sdpSemantics: 'unified-plan'})

      webrtc.ontrack = function (event) {
      console.log(event.streams.length + ' track is delivered')
      return(
        <video  autoplay controls srcObject = {event.streams[0]} style="width: 100%; height: auto;"/>
      )
    }
    webrtc.addTransceiver('video', { direction: 'sendrecv' })
    webrtc.addTransceiver('audio', {direction: 'sendrecv'})
    webrtc.onnegotiationneeded = async function handleNegotiationNeeded () {
      const offer = await webrtc.createOffer()

      await webrtc.setLocalDescription(offer)

      fetch(url, {
        method: 'POST',
        body: new URLSearchParams({ data: btoa(webrtc.localDescription.sdp) })
      })
        .then(response => response.text())
        .then(data => {
          try {
            webrtc.setRemoteDescription(
              new RTCSessionDescription({ type: 'answer', sdp: atob(data) })
            )
          } catch (e) {
            console.warn(e)
          }
        })
    }

    const webrtcSendChannel = webrtc.createDataChannel('rtsptowebSendChannel')
    webrtcSendChannel.onopen = (event) => {
      console.log(`${webrtcSendChannel.label} has opened`)
      webrtcSendChannel.send('ping')
    }
    webrtcSendChannel.onclose = (_event) => {
      console.log(`${webrtcSendChannel.label} has closed`)
      VidPlayer(url)
    }
    webrtcSendChannel.onmessage = event => console.log(event.data)

   }, []);
    
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




