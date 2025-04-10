import { useState, useEffect, useRef } from 'react';

// Define available commands and responses
const COMMANDS = {
  'help': 'Available commands: help, about, skills, secret, clear, play, matrix, dragon, ls, echo, date, whoami, color',
  'about': 'SYSTEM: Commander Farbod Roshani - Cyber Dragon Operative specializing in digital warfare and tactical coding operations.',
  'skills': 'SYSTEM: JavaScript, TypeScript, React, Python, Node.js... and various classified hacking tools.',
  'secret': 'SYSTEM: Accessing classified information... [REDACTED]. Access denied - security protocol 742 activated.',
  'clear': 'CLEAR',
  'play': 'SYSTEM: Launching game module in terminal...\n████████████████████████\n█                      █\n█  DRAGON ARCADE v1.0  █\n█  Use arrow keys      █\n█  Press X to fire     █\n█                      █\n████████████████████████',
  'matrix': 'SYSTEM: Decoding Matrix...\n01001110 01100101 01101111\n01010111 01100001 01101011 01100101\n01010101 01110000\n...\nThe Matrix has you...',
  'dragon': `SYSTEM: 01010010 01100001 01110111 01110010 00100001
        /\\                 /\\
       ( '\\               /' )
        \\'"\\.__    ___.'"\\/
            / '\\  /' \\
           /\\  /\\/ \\ /\\
          / /''    ''     \\
         ( \`\\              /
          \\                / 
           '\\            /
             \\          /`,
  'ls': 'SYSTEM: Directory listing...\nprojects/\nsecret-files/\ndragons.exe\nreadme.txt\nhacknet.sh',
  'echo': 'SYSTEM: Echo command activated. Usage: echo [text]',
  'date': () => `SYSTEM: Current date: ${new Date().toLocaleString()}`,
  'whoami': 'SYSTEM: User identified as: COMMANDER ROSHANI',
  'color': 'SYSTEM: Changing terminal color scheme...'
};

export default function Terminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{type: 'input' | 'output', text: string}[]>([
    { type: 'output', text: 'DRAGON TERMINAL v1.0.3 [CLASSIFIED]' },
    { type: 'output', text: 'Type "help" for available commands.' }
  ]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [terminalColor, setTerminalColor] = useState('text-neon-green');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Handle command submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user input to history
    setHistory(prev => [...prev, { type: 'input', text: `> ${input}` }]);
    
    // Process command
    const fullCommand = input.trim().toLowerCase();
    const [command, ...args] = fullCommand.split(' ');
    
    if (command === 'clear') {
      setHistory([
        { type: 'output', text: 'DRAGON TERMINAL v1.0.3 [CLASSIFIED]' },
        { type: 'output', text: 'Type "help" for available commands.' }
      ]);
    } else if (command === 'echo' && args.length > 0) {
      setHistory(prev => [...prev, { type: 'output', text: `SYSTEM: ${args.join(' ')}` }]);
    } else if (command === 'color') {
      const colors = ['text-neon-green', 'text-neon-pink', 'text-neon-cyan', 'text-amber-400', 'text-blue-400'];
      const nextColor = colors[(colors.indexOf(terminalColor) + 1) % colors.length];
      setTerminalColor(nextColor);
      setHistory(prev => [...prev, { type: 'output', text: 'SYSTEM: Terminal color changed.' }]);
    } else {
      // Get response or default message
      const response = COMMANDS[command as keyof typeof COMMANDS];
      
      let responseText;
      if (typeof response === 'function') {
        responseText = response();
      } else if (response) {
        responseText = response;
      } else {
        responseText = `SYSTEM: Command '${command}' not recognized. Type "help" for available commands.`;
      }
      
      // Add response to history
      setHistory(prev => [...prev, { type: 'output', text: responseText }]);
    }
    
    // Clear input
    setInput('');
  };

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input when clicking anywhere in the terminal
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  // Update time in the terminal status bar
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="terminal-wrapper w-full">
      <div className="text-center mb-8">
        <h2 className="font-vt323 text-4xl text-neon-cyan mb-4 tracking-widest glow-text-cyan">TERMINAL ACCESS</h2>
        <div className="h-[2px] bg-gradient-to-r from-transparent via-neon-pink to-transparent"></div>
      </div>
      
      <div className="mx-auto max-w-2xl">
        {/* Terminal window */}
        <div className="bg-black border-t border-l border-r border-neon-green">
          <div className="flex items-center justify-between px-4 py-1 border-b border-neon-green">
            <div className="font-vt323 text-neon-green text-sm">DRAGON-OS v3.7.5 - CLASSIFIED TERMINAL</div>
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
        </div>
        
        {/* Terminal body */}
        <div 
          ref={terminalRef}
          className={`bg-black border-l border-r border-neon-green p-3 font-vt323 ${terminalColor} h-80 overflow-y-auto text-left scanline`}
          onClick={focusInput}
        >
          {history.map((entry, index) => (
            <div 
              key={index} 
              className={`mb-1 ${entry.type === 'input' ? 'text-neon-pink' : terminalColor} whitespace-pre-wrap`}
            >
              {entry.text}
            </div>
          ))}
          <div className="flex text-neon-pink">
            <span>{"> "}</span>
            <span>{input}</span>
            <span className={`h-5 w-2 bg-neon-pink inline-block ml-0.5 ${cursorVisible ? 'opacity-100' : 'opacity-0'} terminal-cursor`}></span>
          </div>
        </div>
        
        {/* Input form */}
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-black border-t-0 border-l border-r border-b border-neon-green text-neon-pink font-vt323 p-2 focus:outline-none focus:ring-0"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            placeholder="Enter command..."
            autoFocus
          />
          <button 
            type="submit" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-neon-green/20 hover:bg-neon-green/40 px-3 py-1 text-neon-green font-vt323 transition-colors"
          >
            EXECUTE
          </button>
        </form>
        
        {/* Terminal status bar */}
        <div className="bg-black border-b border-l border-r border-neon-green px-4 py-1">
          <div className="flex justify-between items-center font-vt323 text-xs text-neon-green/70">
            <span>STATUS: ONLINE</span>
            <span>SECURITY: LEVEL ALPHA</span>
            <span>CONNECTION: SECURE</span>
            <span id="time">{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 