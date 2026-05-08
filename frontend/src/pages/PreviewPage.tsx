import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobStatus, createShopifyProduct } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useJobStore, Job } from '../store/jobStore';

const PreviewPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { shop } = useAuthStore();
  const { updateJob } = useJobStore();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string>('');
  const [editedContent, setEditedContent] = useState<any>(null);

  useEffect(() => {
    const pollJobStatus = async () => {
      try {
        const response = await getJobStatus(parseInt(jobId!));
        const jobData = response.job;
        setJob(jobData);
        updateJob(jobData.id, jobData);

        if (jobData.generated_content) {
          setEditedContent(JSON.parse(jobData.generated_content));
        }

        if (jobData.status !== 'processing' && jobData.status !== 'pending') {
          setIsLoading(false);
        } else {
          // Poll again in 2 seconds
          setTimeout(pollJobStatus, 2000);
        }
      } catch (err) {
        setError('Failed to fetch job status');
        setIsLoading(false);
      }
    };

    if (jobId) {
      pollJobStatus();
    }
  }, [jobId, updateJob]);

  const handlePublish = async () => {
    if (!job || !editedContent) return;

    try {
      setIsPublishing(true);
      const generatedImages = JSON.parse(job.generated_images || '{}');

      await createShopifyProduct({
        jobId: job.id,
        shopId: shop!,
        title: editedContent.seoTitle,
        description: editedContent.fullDescription,
        images: [generatedImages.generatedImage],
      });

      alert('Product published to Shopify successfully!');
      navigate('/');
    } catch (err) {
      setError('Failed to publish product');
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your product...</p>
        </div>
      </div>
    );
  }

  if (error || job?.status === 'failed') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Generation Failed</h2>
          <p className="text-red-700">{error || job?.errorMessage}</p>
          <button
            onClick={() => navigate('/upload')}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Preview & Edit</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Generated Images */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated Images</h2>
            <div className="space-y-4">
              {job?.inputImageUrl && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Original</p>
                  <img
                    src={job.inputImageUrl}
                    alt="Original"
                    className="w-full rounded-lg border border-gray-300"
                  />
                </div>
              )}
              {job?.generatedImages && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Studio Generated</p>
                  <img
                    src={JSON.parse(job.generatedImages).generatedImage}
                    alt="Generated"
                    className="w-full rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Product Content */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Content</h2>
            {editedContent && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editedContent.seoTitle}
                    onChange={(e) =>
                      setEditedContent({
                        ...editedContent,
                        seoTitle: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description
                  </label>
                  <textarea
                    value={editedContent.shortDescription}
                    onChange={(e) =>
                      setEditedContent({
                        ...editedContent,
                        shortDescription: e.target.value,
                      })
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Description
                  </label>
                  <textarea
                    value={editedContent.fullDescription}
                    onChange={(e) =>
                      setEditedContent({
                        ...editedContent,
                        fullDescription: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    value={editedContent.metaDescription}
                    onChange={(e) =>
                      setEditedContent({
                        ...editedContent,
                        metaDescription: e.target.value,
                      })
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md font-medium hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isPublishing ? 'Publishing...' : 'Publish to Shopify'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
