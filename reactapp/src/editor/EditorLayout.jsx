import React from 'react';
import { Canvas } from './Canvas';
import { Sidebar } from './Sidebar';
import { Toolbar } from './Toolbar';
import { Inspector } from './Inspector';

export default function EditorLayout() {
  return (
    <div className="editor h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      <Toolbar />
      <div className="editor-body flex flex-1 h-[calc(100vh-72px)]">
        <Sidebar />
        <div className="flex-1 overflow-y-auto bg-slate-900 p-8">
          <Canvas />
        </div>
        <Inspector />
      </div>
    </div>
  );
}
