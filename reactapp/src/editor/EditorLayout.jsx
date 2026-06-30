import React from 'react';
import { Canvas } from './Canvas';
import { Sidebar } from './Sidebar';
import { Toolbar } from './Toolbar';
import { Inspector } from './Inspector';

export default function EditorLayout() {
    return (
        <div className="editor min-h-screen bg-slate-950 text-slate-100">
            <Toolbar />
            <div className="editor-body grid min-h-[calc(100vh-72px)] gap-4 px-6 py-5 xl:grid-cols-[280px_minmax(0,320px)]">
                <Sidebar />
                <Canvas />
                <Inspector />
            </div>
        </div>
    );
}