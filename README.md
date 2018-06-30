XSound
=========
  
Web Audio API Library for Synthesizer, Effects, Visualization, Recording ... etc
  
## Overview
  
XSound is Multifunctional Library for Web Audio API.  
In concrete, XSound may be useful to implement the following features.
  
- Create Sound
- Play the One-Shot Audio
- Play the Audio
- Play the Media
- Streaming (by WebRTC)
- MIDI (by Web MIDI API)
- MML (Music Macro Language)
- Effectors (Compressor / Wah / Equalizer / Tremolo / Phaser / Chorus / Delay / Reverb ... etc)
- Visualization (Overview in Time Domain / Time Domain / Spectrum)
- Recording (Create WAVE file)
- Session (by WebSocket)
  
XSound don't depend on other libraries or frameworks (For example, jQuery, React).
  
![support-browsers](images/support-browsers.jpg)
  
## Getting Started

```JavaScript
X('oscillator').setup(true).ready().start(440);
```

## Demo
  
The application that uses XSound is in the following URLs.
  
- [X Sound](https://korilakkuma.github.io/X-Sound/)
- [Music V](https://weblike-curtaincall.ssl-lolipop.jp/portfolio-music-v/)
- [Music Tweet](https://github.com/Korilakkuma/Music-Tweet)
  
Now, I'm creating website for Web Audio API. Please refer to the following site for understanding API Documentation.
  
- [WEB SOUNDER](https://weblike-curtaincall.ssl-lolipop.jp/portfolio-web-sounder/)
  
## Installation

```bash
$ npm install --save xsound
```

## Usage

```HTML
<script type="text/javascript" src="xsound.js"></script>
```

In the case of using WebSocket,

```bash
$ node xsound-server-session-websocket.js
```

or,

```bash
$ node xsound-server-session-ws.js
```

Default port number is 8000.  
This port number can be changed by designating argument.  
For example,

```bash
$ node xsound-server-session-websocket.js 8080
```

In the case of recording log, the path of log file must be designated by the 2nd argument.

```bash
$ node xsound-server-session-websocket.js 8080 websocket.log
```

## API Documentation
  
- [XSound API Documentation](https://korilakkuma.github.io/xsound-api/)
  
## License
  
Copyright (c) 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018 Tomohiro IKEDA (Korilakkuma)  
Released under the MIT license
  
