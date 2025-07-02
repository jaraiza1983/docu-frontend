import React, { useEffect, useRef, useState } from 'react';

interface TinyMCEProps {
  value: string;
  onChange: (data: string) => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
}

declare global {
  interface Window {
    tinymce: any;
  }
}

const TinyMCE: React.FC<TinyMCEProps> = ({
  value,
  onChange,
  placeholder = 'Write the content description...',
  height = 300,
  disabled = false
}) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Cargar TinyMCE
  useEffect(() => {
    if (window.tinymce) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.tiny.cloud/1/xf35lgihc569waf9h0vyaagd8md18xs7ywluexhi1ewstyo7/tinymce/6/tinymce.min.js';
    script.async = true;
    
    script.onload = () => {
      console.log('TinyMCE loaded');
      setIsLoaded(true);
    };
    
    script.onerror = () => {
      console.error('Error loading TinyMCE');
      setUseFallback(true);
    };

    document.head.appendChild(script);
  }, []);

  // Inicializar editor
  useEffect(() => {
    if (isLoaded && editorRef.current && !editorInstance && !useFallback) {
      setTimeout(() => {
        try {
          console.log('Inicializando TinyMCE...');
          
          const config = {
            selector: `#${editorRef.current?.id}`,
            height: height,
            language: 'es',
            apiKey: 'xf35lgihc569waf9h0vyaagd8md18xs7ywluexhi1ewstyo7',
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons',
              'template', 'paste', 'textpattern', 'nonbreaking', 'pagebreak',
              'quickbars', 'codesample', 'directionality', 'visualchars'
            ],
            toolbar: 'undo redo | blocks | bold italic underline strikethrough | ' +
                     'alignleft aligncenter alignright alignjustify | ' +
                     'bullist numlist outdent indent | link image media table | ' +
                     'forecolor backcolor removeformat | pagebreak | charmap emoticons | ' +
                     'fullscreen preview save print | insertfile template codesample | ' +
                     'ltr rtl | searchreplace | help',
            menubar: 'file edit view insert format tools table help',
            branding: false,
            promotion: false,
            placeholder: placeholder,
            content_style: `
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
              .mce-content-body { font-size: 14px; line-height: 1.6; }
            `,
            quickbars_selection_toolbar: 'bold italic underline | quicklink h2 h3 blockquote',
            quickbars_insert_toolbar: false,
            textpattern_patterns: [
              {start: '*', end: '*', format: 'italic'},
              {start: '**', end: '**', format: 'bold'},
              {start: '#', format: 'h1'},
              {start: '##', format: 'h2'},
              {start: '###', format: 'h3'},
              {start: '####', format: 'h4'},
              {start: '#####', format: 'h5'},
              {start: '######', format: 'h6'},
              {start: '1. ', cmd: 'InsertOrderedList'},
              {start: '* ', cmd: 'InsertUnorderedList'},
              {start: '- ', cmd: 'InsertUnorderedList'}
            ],
            setup: function(editor: any) {
              editor.on('init', function() {
                console.log('TinyMCE listo');
                if (value) {
                  editor.setContent(value);
                }
              });
              
              editor.on('change keyup', function() {
                const content = editor.getContent();
                onChange(content);
              });
            }
          };

          window.tinymce.init(config).then((editors: any[]) => {
            if (editors.length > 0) {
              setEditorInstance(editors[0]);
              console.log('TinyMCE inicializado correctamente');
            }
          });
          
        } catch (error) {
          console.error('Error initializing TinyMCE:', error);
          setUseFallback(true);
        }
      }, 200);
    }
  }, [isLoaded, editorInstance, useFallback, height, value, onChange, placeholder]);

  // Actualizar contenido
  useEffect(() => {
    if (editorInstance && !isUpdating) {
      try {
        const currentContent = editorInstance.getContent();
        if (currentContent !== value) {
          setIsUpdating(true);
          editorInstance.setContent(value);
          setIsUpdating(false);
        }
      } catch (error) {
        console.warn('Error updating TinyMCE:', error);
      }
    }
  }, [value, editorInstance, isUpdating]);

  // Manejar estado disabled
  useEffect(() => {
    if (editorInstance) {
      try {
        if (disabled) {
          editorInstance.setMode('readonly');
        } else {
          editorInstance.setMode('design');
        }
      } catch (error) {
        console.warn('Error al cambiar estado de TinyMCE:', error);
      }
    }
  }, [disabled, editorInstance]);

  // Limpiar
  useEffect(() => {
    return () => {
      if (editorInstance) {
        try {
          editorInstance.destroy();
        } catch (error) {
          console.warn('Error al destruir TinyMCE:', error);
        }
      }
    };
  }, [editorInstance]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Fallback
  if (useFallback) {
    return (
      <div className="tinymce-container">
        <textarea
          className="form-control"
          value={value}
          onChange={handleTextareaChange}
          placeholder={placeholder}
          rows={Math.floor(height / 20)}
          disabled={disabled}
          style={{ minHeight: `${height}px` }}
        />
        <div className="alert alert-warning mt-2">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Using simple text editor (TinyMCE not available)
        </div>
      </div>
    );
  }

  // Cargando
  if (!isLoaded) {
    return (
      <div className="tinymce-container">
        <div className="d-flex align-items-center justify-content-center" style={{ height: `${height}px`, backgroundColor: '#f8f9fa' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-2" role="status"></div>
            <div className="text-muted">Loading editor...</div>
          </div>
        </div>
      </div>
    );
  }

  // Editor
  return (
    <div className="tinymce-container">
      <textarea
        ref={editorRef}
        id={`tinymce-editor-${Date.now()}`}
        value={value}
        onChange={handleTextareaChange}
        placeholder={placeholder}
        rows={Math.floor(height / 20)}
        disabled={disabled}
        style={{ minHeight: `${height}px` }}
      />
    </div>
  );
};

export default TinyMCE; 