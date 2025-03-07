export class VoiceUtils {

  static allVoices : SpeechSynthesisVoice[] = [];
  static preferedVoice : SpeechSynthesisVoice|null = null;

  static interLinePause : number = 3;
  static utteranceRate : number = 50;

  static speakingFlag = false;

  static setUtteranceRate(utteranceRate : number) {
    this.utteranceRate = utteranceRate;
  }

  static setInterLinePause(interLinePause : number) {
    this.interLinePause = interLinePause;
    console.log("Setting interlinePause to ", this.interLinePause);
  }

  static listVoices() {
    const fetchVoices = () => {
      const voices = window.speechSynthesis.getVoices(); // Get the voices
      voices.forEach(voice => console.log(voice));

      VoiceUtils.allVoices.push(...voices);

      if (window.speechSynthesis.pending)
        setTimeout(fetchVoices, 1000);
      else {
        const voices = VoiceUtils.allVoices.filter(voice => (voice.lang == 'en-IN')).sort();
        if (voices.length > 0)
          VoiceUtils.preferedVoice = voices[0]; 
      }
    }
    fetchVoices();
    window.speechSynthesis.onvoiceschanged = fetchVoices;
  }

  static expandPuctuations(text : string) {
    const punctuationMap : { [key: string]: string } = {
      ".": " period ",
      ",": " comma ",
      "!": " exclamation point ",
      "?": " question mark ",
      ":": " colon ",
      ";": " semicolon ",
      "-": " hyphen ", // Or "dash" depending on context
      "(": " open parenthesis ",
      ")": " close parenthesis ",
      "[": " open bracket ",
      "]": " close bracket ",
      "{": " open brace ",
      "}": " close brace ",
      "'": " apostrophe ", // Or handle contextually (possessive vs. quotation)
      "\"": " quotation mark ", // Or handle as double quotes
      "`": " backtick ",
      "@": " at symbol ",
      "#": " number sign ", // Or "hash" or "pound"
      "$": " dollar sign ",
      "%": " percent sign ",
      "^": " caret ",
      "&": " ampersand ",
      "*": " asterisk ",
      "+": " plus sign ",
      "=": " equals sign ",
      "/": " slash ",
      "\\": " backslash ",
      "|": " vertical bar ",
      "<": " less than ",
      ">": " greater than ",
    };
  
    if (!text) return text;
    let newText = ''
    for(let i = 0; i < text.length; i++) {
      let char = text[i];
      if (punctuationMap[char]) 
        char = " " + punctuationMap[char] + char + " "
      newText = newText + char;
    }
    return newText;
  }
  
  static speakAsIs(phrase : string) {
    console.log("New utterance generated ", phrase);

    const utterance = new SpeechSynthesisUtterance(phrase);

    utterance.rate = this.utteranceRate / 100.0;
    if (VoiceUtils.preferedVoice)
      utterance.voice = VoiceUtils.preferedVoice;
    console.log("Using voice ", VoiceUtils.preferedVoice);

    window.speechSynthesis.speak(utterance);
    return utterance;
  }

  static speakPhrase(phrase : string) {
    const expandedPhrase = VoiceUtils.expandPuctuations(phrase);
    const utterance = VoiceUtils.speakAsIs(expandedPhrase);
    return utterance;
  }

  static speakPhrasesFromP(phrases : string[], lineNum : number, onNextPhrase : ()=>void ) {
    // console.log("Speak phrases from private ", lineNum, "speak flag = ", VoiceUtils.speakingFlag);

    if (lineNum >= phrases.length) {
      console.log("End speaking as phrases have finished");
      VoiceUtils.speakingFlag = false;
      return;
    }

    const phrase = phrases[lineNum];
    if (!VoiceUtils.speakingFlag)
      return;

    console.log("Before speak phrase ", VoiceUtils.speakingFlag);
    const utterance = VoiceUtils.speakPhrase(phrase);
    utterance.onend = () => {
      const speakingFlagStr = (VoiceUtils.speakingFlag) ? "Continue speaking" : "Stop speaking now"
      // console.log("Checking speaking flag at end ", speakingFlagStr, lineNum);

      console.log("Pausing for ", this.interLinePause, " seconds");
      if (VoiceUtils.speakingFlag) {
        setTimeout( () => {
          onNextPhrase();
          this.speakPhrasesFromP(phrases, Number(lineNum)+1, onNextPhrase);
        }, this.interLinePause*1000);  
      }
    }
  }

  static speakPhrasesFrom(phrases : string[], lineNum : number, onNextPhrase : ()=>void ) {
    VoiceUtils.speakingFlag = true;
    console.log("Start speaking ", lineNum, ". Speaking set. Flag is ", VoiceUtils.speakingFlag);
    this.speakPhrasesFromP(phrases, lineNum, onNextPhrase);
  }

  static speakPhrases(phrases : string[], onNextPhrase : ()=>void ) {
    VoiceUtils.speakPhrasesFrom(phrases, 0, onNextPhrase);
  }

  static stopSpeaking() {
    VoiceUtils.speakingFlag = false;
    console.log("Stop button pressed. From menu this.speakingFlag = ", VoiceUtils.speakingFlag);
    window.speechSynthesis.cancel();
  }
}

VoiceUtils.listVoices();
