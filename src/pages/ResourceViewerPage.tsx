import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ResourceViewerModal } from '../components/viewer/ResourceViewerModal';

export const ResourceViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getResource } = useData();

  const resource = id ? getResource(id) : undefined;

  useEffect(() => {
    if (!resource && id) {
      // If resource not found, navigate back to workspace
      const timeout = setTimeout(() => {
        navigate('/workspace');
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [resource, id, navigate]);

  if (!resource) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-slate-800">Loading Study Material...</h2>
        <p className="text-xs text-slate-400 mt-2">Connecting to verified community archive...</p>
      </div>
    );
  }

  return (
    <ResourceViewerModal
      resourceId={resource.id}
      onClose={() => navigate(-1)}
    />
  );
};
