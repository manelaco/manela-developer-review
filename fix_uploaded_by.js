const fs = require('fs');
let content = fs.readFileSync('src/pages/api/documents/upload.ts', 'utf8');

// Remove the uploaded_by field that's causing the foreign key constraint
content = content.replace(
  /uploaded_by: companyId,\s*/g,
  '// uploaded_by: removed to avoid foreign key constraint,\n        '
);

fs.writeFileSync('src/pages/api/documents/upload.ts', content);
console.log('Removed uploaded_by field to fix foreign key constraint!');
