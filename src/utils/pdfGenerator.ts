/**
 * Generates an authentic downloadable and embeddable PDF document in pure JavaScript.
 * Produces a valid PDF 1.4 binary data structure that native browser PDF viewers
 * (Chrome, Edge, Firefox, Safari) can render directly inside <iframe> containers on the site.
 */

export function generatePdfDataUrl(
  title: string,
  subject: string,
  community: string,
  uploader: string,
  contentPages: string[]
): string {
  // Build PDF 1.4 representation
  const escapePdfText = (str: string) => {
    return str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  };

  const pages = contentPages.length > 0 ? contentPages : [
    `Study Notes for ${title}\nCourse: ${subject}\nShared in: ${community}\nUploaded by: ${uploader}`
  ];

  // We construct standard PDF objects
  let objectIndex = 1;
  const objects: string[] = [];
  const pageObjectRefs: string[] = [];

  // Object 1: Catalog (will be added after pages)
  // Object 2: Font
  // Object 3: Bold Font

  const fontObjIdx = 2;
  const boldFontObjIdx = 3;

  // Pre-define font objects
  const fontObj = `${fontObjIdx} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj`;
  const boldFontObj = `${boldFontObjIdx} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj`;

  objectIndex = 4; // Start page objects from 4

  for (let i = 0; i < pages.length; i++) {
    const pageText = pages[i];
    const lines = pageText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0)
      .slice(0, 35); // Max lines per page

    const contentObjIdx = objectIndex++;
    const pageObjIdx = objectIndex++;

    pageObjectRefs.push(`${pageObjIdx} 0 R`);

    // Stream content for this page
    let streamLines = [
      // Top header bar
      'q',
      '0.15 0.35 0.85 rg',
      '40 740 532 30 re f',
      '1 1 1 rg',
      'BT',
      `/F2 12 Tf`,
      '50 750 Td',
      `(${escapePdfText(`StudySpace Academic Archive • ${community} • ${subject}`)}) Tj`,
      'ET',
      'Q',

      // Document title
      'BT',
      '0.1 0.1 0.15 rg',
      `/F2 16 Tf`,
      '50 705 Td',
      `(${escapePdfText(title)}) Tj`,
      'ET',

      // Subtitle info
      'BT',
      '0.4 0.4 0.4 rg',
      `/F1 9 Tf`,
      '50 690 Td',
      `(${escapePdfText(`Verified Study Material • Shared by ${uploader} • Page ${i + 1} of ${pages.length}`)}) Tj`,
      'ET',

      // Divider line
      'q',
      '0.8 0.8 0.85 RG',
      '1 w',
      '50 675 m 562 675 l S',
      'Q',
    ];

    // Body lines
    let y = 650;
    for (const line of lines) {
      if (y < 80) break;
      const isHeading = line.startsWith('#') || line.startsWith('Topic') || line.startsWith('Unit') || line.startsWith('Question');
      const cleanLine = line.replace(/^[#*`\s]+/, '').replace(/[*`$]/g, '');

      if (isHeading) {
        streamLines.push(
          'BT',
          '0.15 0.25 0.6 rg',
          `/F2 11 Tf`,
          `50 ${y} Td`,
          `(${escapePdfText(cleanLine.slice(0, 80))}) Tj`,
          'ET'
        );
        y -= 22;
      } else {
        streamLines.push(
          'BT',
          '0.2 0.2 0.25 rg',
          `/F1 10 Tf`,
          `50 ${y} Td`,
          `(${escapePdfText(cleanLine.slice(0, 95))}) Tj`,
          'ET'
        );
        y -= 16;
      }
    }

    // Page footer watermark
    streamLines.push(
      'q',
      '0.85 0.85 0.9 RG',
      '1 w',
      '50 50 m 562 50 l S',
      'Q',
      'BT',
      '0.5 0.5 0.55 rg',
      `/F1 8 Tf`,
      '50 38 Td',
      `(${escapePdfText(`StudySpace Collaborative Campus Platform — Zero Duplicate Personal Workspace`)}) Tj`,
      'ET',
      'BT',
      '0.5 0.5 0.55 rg',
      `/F2 8 Tf`,
      '520 38 Td',
      `(${escapePdfText(`Page ${i + 1}/${pages.length}`)}) Tj`,
      'ET'
    );

    const streamContent = streamLines.join('\n');
    const contentObj = `${contentObjIdx} 0 obj\n<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream\nendobj`;

    const pageObj = `${pageObjIdx} 0 obj\n<< /Type /Page /Parent 1 0 R /MediaBox [0 0 612 792] /Contents ${contentObjIdx} 0 R /Resources << /Font << /F1 ${fontObjIdx} 0 R /F2 ${boldFontObjIdx} 0 R >> >> >>\nendobj`;

    objects.push(contentObj);
    objects.push(pageObj);
  }

  // Object 1: Pages Collection
  const pagesObj = `1 0 obj\n<< /Type /Pages /Kids [${pageObjectRefs.join(' ')}] /Count ${pages.length} >>\nendobj`;

  // Catalog object
  const catalogObjIdx = objectIndex++;
  const catalogObj = `${catalogObjIdx} 0 obj\n<< /Type /Catalog /Pages 1 0 R >>\nendobj`;

  const allObjects = [pagesObj, fontObj, boldFontObj, ...objects, catalogObj];

  // Assemble full PDF
  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];

  for (const obj of allObjects) {
    offsets.push(pdf.length);
    pdf += obj + '\n';
  }

  const xrefOffset = pdf.length;
  pdf += 'xref\n';
  pdf += `0 ${allObjects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (const offset of offsets) {
    pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`;
  }

  pdf += 'trailer\n';
  pdf += `<< /Size ${allObjects.length + 1} /Root ${catalogObjIdx} 0 R >>\n`;
  pdf += 'startxref\n';
  pdf += `${xrefOffset}\n`;
  pdf += '%%EOF';

  const blob = new Blob([pdf], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}
