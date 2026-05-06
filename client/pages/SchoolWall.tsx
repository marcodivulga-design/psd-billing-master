'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdaptiveText from '@/components/AdaptiveText';
import { useToast } from '@/components/ui/use-toast';

/**
 * SchoolWall.tsx - Mural da Escola (Rede Social Educativa)
 * 
 * Alunos publicam:
 * - Desenhos
 * - Poemas
 * - Músicas
 * - Teatro
 * - Trabalhos
 * 
 * Professor aprova antes
 */

interface Post {
  id: string;
  author: string;
  authorId: string;
  type: 'drawing' | 'poem' | 'music' | 'theater' | 'project' | 'photo';
  title: string;
  description: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  approved: boolean;
  createdAt: string;
  grade: string;
}

const SchoolWall: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Ana Silva',
      authorId: 'student_001',
      type: 'drawing',
      title: 'Natureza em Aquarela',
      description: 'Meu trabalho de Artes sobre a natureza',
      content: 'Desenho em aquarela de uma floresta',
      likes: 24,
      comments: 5,
      approved: true,
      createdAt: '2024-01-20',
      grade: '5º ano',
    },
    {
      id: '2',
      author: 'João Santos',
      authorId: 'student_002',
      type: 'poem',
      title: 'Poesia sobre a Amizade',
      description: 'Poema criado para a aula de Português',
      content: 'A amizade é um tesouro raro...',
      likes: 18,
      comments: 3,
      approved: true,
      createdAt: '2024-01-19',
      grade: '6º ano',
    },
    {
      id: '3',
      author: 'Maria Oliveira',
      authorId: 'student_003',
      type: 'project',
      title: 'Projeto: Sustentabilidade',
      description: 'Pesquisa sobre reciclagem e meio ambiente',
      content: 'Projeto interdisciplinar sobre sustentabilidade',
      likes: 32,
      comments: 8,
      approved: true,
      createdAt: '2024-01-18',
      grade: '7º ano',
    },
  ]);

  const [pendingApproval, setPendingApproval] = useState<Post[]>([
    {
      id: 'pending_1',
      author: 'Carlos Mendes',
      authorId: 'student_004',
      type: 'music',
      title: 'Música Original',
      description: 'Composição para a aula de Música',
      content: 'Música instrumental criada por mim',
      likes: 0,
      comments: 0,
      approved: false,
      createdAt: '2024-01-20',
      grade: '8º ano',
    },
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({
    type: 'drawing' as Post['type'],
    title: '',
    description: '',
    content: '',
  });
  const { toast } = useToast();

  const postTypes = {
    drawing: { icon: '🎨', label: 'Desenho' },
    poem: { icon: '✍️', label: 'Poema' },
    music: { icon: '🎵', label: 'Música' },
    theater: { icon: '🎭', label: 'Teatro' },
    project: { icon: '📋', label: 'Projeto' },
    photo: { icon: '📸', label: 'Foto' },
  };

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) {
      toast({
        title: '⚠️ Preencha todos os campos',
        description: 'Título e conteúdo são obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    const post: Post = {
      id: `post_${Date.now()}`,
      author: 'Você',
      authorId: 'current_user',
      type: newPost.type,
      title: newPost.title,
      description: newPost.description,
      content: newPost.content,
      likes: 0,
      comments: 0,
      approved: false,
      createdAt: new Date().toISOString().split('T')[0],
      grade: '5º ano',
    };

    setPendingApproval([...pendingApproval, post]);
    setShowCreateForm(false);
    setNewPost({ type: 'drawing', title: '', description: '', content: '' });

    toast({
      title: '✅ Publicação enviada!',
      description: 'Seu trabalho foi enviado para aprovação do professor',
      variant: 'success',
    });
  };

  const handleApprovePost = (postId: string) => {
    const post = pendingApproval.find((p) => p.id === postId);
    if (post) {
      setPosts([{ ...post, approved: true }, ...posts]);
      setPendingApproval(pendingApproval.filter((p) => p.id !== postId));

      toast({
        title: '✅ Publicação aprovada!',
        description: `"${post.title}" foi publicada no mural`,
        variant: 'success',
      });
    }
  };

  const handleRejectPost = (postId: string) => {
    const post = pendingApproval.find((p) => p.id === postId);
    if (post) {
      setPendingApproval(pendingApproval.filter((p) => p.id !== postId));

      toast({
        title: '❌ Publicação rejeitada',
        description: `"${post.title}" não foi aprovada`,
        variant: 'destructive',
      });
    }
  };

  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map((p) =>
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      )
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <AdaptiveText variant="heading" className="text-4xl mb-2">
            🎨 Mural da Escola
          </AdaptiveText>
          <AdaptiveText variant="subheading" className="text-gray-600">
            Compartilhe seus trabalhos criativos com a comunidade escolar
          </AdaptiveText>
        </motion.div>

        {/* Create Post Button */}
        <motion.div variants={itemVariants} className="mb-8">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
          >
            ➕ Compartilhar Trabalho
          </button>
        </motion.div>

        {/* Create Form */}
        {showCreateForm && (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow-lg p-6 mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <AdaptiveText variant="heading">Criar Publicação</AdaptiveText>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-2xl hover:scale-110 transition-transform"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Tipo de Trabalho</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.entries(postTypes) as [Post['type'], typeof postTypes[Post['type']]][]).map(
                    ([type, { icon, label }]) => (
                      <button
                        key={type}
                        onClick={() => setNewPost({ ...newPost, type })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          newPost.type === type
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="text-2xl mb-1">{icon}</div>
                        <div className="text-xs font-bold">{label}</div>
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Título</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="Título do seu trabalho"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Descrição</label>
                <input
                  type="text"
                  value={newPost.description}
                  onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                  placeholder="Conte sobre seu trabalho"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Conteúdo/Detalhes</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Descreva seu trabalho em detalhes"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                  rows={4}
                />
              </div>

              <button
                onClick={handleCreatePost}
                className="w-full px-4 py-3 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 transition-colors"
              >
                ✅ Enviar para Aprovação
              </button>
            </div>
          </motion.div>
        )}

        {/* Pending Approval (Teacher View) */}
        {pendingApproval.length > 0 && (
          <motion.div variants={itemVariants} className="mb-8">
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
              <AdaptiveText variant="heading" className="mb-4">
                ⏳ Aguardando Aprovação ({pendingApproval.length})
              </AdaptiveText>

              <div className="space-y-4">
                {pendingApproval.map((post) => (
                  <motion.div
                    key={post.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-lg p-4 border-2 border-yellow-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">
                            {postTypes[post.type].icon}
                          </span>
                          <div>
                            <div className="font-bold">{post.title}</div>
                            <div className="text-sm text-gray-600">
                              por {post.author} ({post.grade})
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{post.description}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprovePost(post.id)}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-bold"
                      >
                        ✅ Aprovar
                      </button>
                      <button
                        onClick={() => handleRejectPost(post.id)}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-bold"
                      >
                        ❌ Rejeitar
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Published Posts */}
        <motion.div variants={itemVariants} className="space-y-4">
          <AdaptiveText variant="heading" className="text-2xl mb-4">
            📌 Publicações ({posts.length})
          </AdaptiveText>

          {posts.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">🎨</div>
              <AdaptiveText variant="body">
                Nenhuma publicação ainda. Seja o primeiro a compartilhar!
              </AdaptiveText>
            </div>
          ) : (
            posts.map((post) => (
              <motion.div
                key={post.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-3xl">{postTypes[post.type].icon}</span>
                      <div>
                        <div className="text-xl font-bold">{post.title}</div>
                        <div className="text-sm text-gray-600">
                          por {post.author} • {post.grade} • {post.createdAt}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{post.description}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700">{post.content}</p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-bold"
                  >
                    ❤️ {post.likes}
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-bold">
                    💬 {post.comments}
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-bold">
                    🔗 Compartilhar
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SchoolWall;
