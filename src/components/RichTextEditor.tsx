import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function RichTextEditor({ value, onChange }: { value: string, onChange: (value: string) => void }) {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="bg-white">
      <ReactQuill theme="snow" value={value} onChange={onChange} modules={modules} className="h-64 mb-12" />
    </div>
  );
}
