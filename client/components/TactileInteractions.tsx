/**
 * TactileInteractions.tsx
 * 
 * EDUCAÇÃO INFANTIL - INTERAÇÕES TÁTEIS
 * 
 * Componentes para crianças de 4-6 anos:
 * - Drag and drop
 * - Toque simples
 * - Desenho
 * - Sons de feedback
 * - Animações suaves
 */

'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ============================================================================
// DRAG AND DROP PARA INFANTIL
// ============================================================================

interface DragDropItem {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

interface DragDropZone {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

export const TactileDragDrop: React.FC<{
  items: DragDropItem[];
  zones: DragDropZone[];
  onComplete: (matches: Record<string, string>) => void;
}> = ({ items, zones, onComplete }) => {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId);
    playSound('drag');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (zoneId: string) => {
    if (draggedItem) {
      const newMatches = { ...matches, [draggedItem]: zoneId };
      setMatches(newMatches);
      playSound('drop');

      if (Object.keys(newMatches).length === items.length) {
        playSound('success');
        setTimeout(() => onComplete(newMatches), 500);
      }
    }
    setDraggedItem(null);
  };

  const playSound = (type: string) => {
    // Simular som (em produção, usar Web Audio API)
    console.log(`Sound: ${type}`);
  };

  return (
    <div className="p-8 bg-gradient-to-b from-blue-100 to-purple-100 rounded-3xl">
      {/* Itens para Arrastar */}
      <div className="mb-12">
        <h3 className="text-3xl font-bold text-gray-800 mb-6">🎯 Arraste os itens</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item) => (
            <motion.div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(item.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`${item.color} rounded-3xl p-8 cursor-grab active:cursor-grabbing shadow-lg hover:shadow-xl transition-shadow`}
            >
              <div className="text-6xl mb-3">{item.emoji}</div>
              <div className="text-xl font-bold text-white text-center">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Zonas de Soltar */}
      <div>
        <h3 className="text-3xl font-bold text-gray-800 mb-6">📍 Solte aqui</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {zones.map((zone) => (
            <motion.div
              key={zone.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(zone.id)}
              className={`${zone.color} rounded-3xl p-8 border-4 border-dashed border-white min-h-32 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform`}
            >
              <div className="text-center">
                <div className="text-5xl mb-2">{zone.emoji}</div>
                <div className="text-lg font-bold text-white">{zone.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TOQUE SIMPLES COM FEEDBACK
// ============================================================================

interface TactileTapItem {
  id: string;
  emoji: string;
  sound: string;
  color: string;
}

export const TactileTapBoard: React.FC<{
  items: TactileTapItem[];
  onTap: (itemId: string) => void;
}> = ({ items, onTap }) => {
  const [tappedItems, setTappedItems] = useState<Set<string>>(new Set());

  const handleTap = (itemId: string) => {
    setTappedItems((prev) => new Set([...prev, itemId]));
    onTap(itemId);
    playSound('tap');
  };

  const playSound = (type: string) => {
    console.log(`Sound: ${type}`);
  };

  return (
    <div className="p-8 bg-gradient-to-b from-pink-100 to-yellow-100 rounded-3xl">
      <h3 className="text-3xl font-bold text-gray-800 mb-8">👆 Toque nos itens!</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => handleTap(item.id)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className={`${item.color} rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow relative`}
          >
            <div className="text-7xl">{item.emoji}</div>
            {tappedItems.has(item.id) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 rounded-3xl bg-white/30 flex items-center justify-center"
              >
                <div className="text-5xl">✨</div>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// DESENHO SIMPLES
// ============================================================================

export const TactileDrawingBoard: React.FC<{
  onDrawingComplete: (imageData: string) => void;
}> = ({ onDrawingComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setContext(ctx);
      }
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect && context) {
      context.beginPath();
      context.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !context) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      context.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      context.strokeStyle = '#ff6b9d';
      context.lineWidth = 8;
      context.lineCap = 'round';
      context.stroke();
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    if (context && canvasRef.current) {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleSave = () => {
    if (canvasRef.current) {
      const imageData = canvasRef.current.toDataURL();
      onDrawingComplete(imageData);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-b from-purple-100 to-pink-100 rounded-3xl">
      <h3 className="text-3xl font-bold text-gray-800 mb-6">🎨 Desenhe!</h3>
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full border-4 border-white rounded-2xl bg-white cursor-crosshair shadow-lg"
      />
      <div className="flex gap-4 mt-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClear}
          className="flex-1 bg-red-400 hover:bg-red-500 text-white font-bold py-4 px-6 rounded-2xl text-2xl transition-colors"
        >
          🗑️ Limpar
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className="flex-1 bg-green-400 hover:bg-green-500 text-white font-bold py-4 px-6 rounded-2xl text-2xl transition-colors"
        >
          ✅ Pronto!
        </motion.button>
      </div>
    </div>
  );
};

// ============================================================================
// JOGO DE SONS
// ============================================================================

interface SoundItem {
  id: string;
  emoji: string;
  sound: string;
  label: string;
  color: string;
}

export const TactileSoundBoard: React.FC<{
  items: SoundItem[];
}> = ({ items }) => {
  const [activeSounds, setActiveSounds] = useState<Set<string>>(new Set());

  const playSound = (soundId: string) => {
    setActiveSounds((prev) => new Set([...prev, soundId]));
    console.log(`Playing sound: ${soundId}`);
    setTimeout(() => {
      setActiveSounds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(soundId);
        return newSet;
      });
    }, 500);
  };

  return (
    <div className="p-8 bg-gradient-to-b from-green-100 to-blue-100 rounded-3xl">
      <h3 className="text-3xl font-bold text-gray-800 mb-8">🔊 Toque para ouvir!</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => playSound(item.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={activeSounds.has(item.id) ? { scale: [1, 1.2, 1] } : {}}
            className={`${item.color} rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow`}
          >
            <div className="text-6xl mb-2">{item.emoji}</div>
            <div className="text-lg font-bold text-white">{item.label}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// PÁGINA COMPLETA DE INFANTIL COM INTERAÇÕES TÁTEIS
// ============================================================================

export const ChildrensInteractiveHub: React.FC = () => {
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);

  const dragDropItems: DragDropItem[] = [
    { id: '1', label: 'Maçã', emoji: '🍎', color: 'bg-red-400' },
    { id: '2', label: 'Banana', emoji: '🍌', color: 'bg-yellow-400' },
    { id: '3', label: 'Uva', emoji: '🍇', color: 'bg-purple-400' },
    { id: '4', label: 'Morango', emoji: '🍓', color: 'bg-pink-400' },
  ];

  const dragDropZones: DragDropZone[] = [
    { id: 'z1', label: 'Cesta', emoji: '🧺', color: 'bg-orange-300' },
    { id: 'z2', label: 'Prato', emoji: '🍽️', color: 'bg-blue-300' },
    { id: 'z3', label: 'Geladeira', emoji: '🧊', color: 'bg-cyan-300' },
    { id: 'z4', label: 'Lixo', emoji: '🗑️', color: 'bg-gray-300' },
  ];

  const tapItems: TactileTapItem[] = [
    { id: '1', emoji: '🎈', sound: 'balloon', color: 'bg-red-400' },
    { id: '2', emoji: '🎪', sound: 'circus', color: 'bg-yellow-400' },
    { id: '3', emoji: '🎡', sound: 'carousel', color: 'bg-purple-400' },
    { id: '4', emoji: '🎢', sound: 'rollercoaster', color: 'bg-pink-400' },
  ];

  const soundItems: SoundItem[] = [
    { id: '1', emoji: '🐶', sound: 'dog', label: 'Au au!', color: 'bg-orange-400' },
    { id: '2', emoji: '🐱', sound: 'cat', label: 'Miau!', color: 'bg-pink-400' },
    { id: '3', emoji: '🦆', sound: 'duck', label: 'Quá!', color: 'bg-yellow-400' },
    { id: '4', emoji: '🐮', sound: 'cow', label: 'Muuu!', color: 'bg-white' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-2">🎉 Bem-vindo ao Mundo Mágico!</h1>
          <p className="text-2xl text-white">Toque, arraste e divirta-se aprendendo!</p>
        </motion.div>

        {/* Atividades */}
        <div className="space-y-8">
          {/* Drag and Drop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <TactileDragDrop
              items={dragDropItems}
              zones={dragDropZones}
              onComplete={(matches) => {
                setCompletedActivities([...completedActivities, 'dragdrop']);
              }}
            />
          </motion.div>

          {/* Tap Board */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <TactileTapBoard items={tapItems} onTap={() => {}} />
          </motion.div>

          {/* Drawing Board */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <TactileDrawingBoard onDrawingComplete={() => {}} />
          </motion.div>

          {/* Sound Board */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <TactileSoundBoard items={soundItems} />
          </motion.div>
        </div>

        {/* Progresso */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-white rounded-3xl p-8 shadow-lg inline-block">
            <div className="text-4xl mb-2">🌟</div>
            <div className="text-2xl font-bold text-gray-800">
              {completedActivities.length} atividades concluídas!
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
