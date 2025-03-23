import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";
import { AssessmentDetails } from "../../pages/AssessmentPages/AssessmentDetailsPage/AssessmentDetailsPage";

const SCALE_FACTOR = 0.6;

const convertSvgToPngBlob = async (svgData: string): Promise<Blob | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      let width = img.naturalWidth || 800;
      let height = img.naturalHeight || 800;

      // Apply scaling factor
      width = Math.round(width * SCALE_FACTOR);
      height = Math.round(height * SCALE_FACTOR);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          resolve(blob || null);
        }, "image/png");
      }
      URL.revokeObjectURL(url);
    };

    img.src = url;
  });
};

export const generateWordDoc = async (assessmentDetails: AssessmentDetails) => {
  let subQuestionCounter = 1;
	const paragraphs: Paragraph[] = [];


  for (const question of assessmentDetails.questions) {
    if (!question.subquestions) continue;

    for (const subq of question.subquestions) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
							text: `${subQuestionCounter}. ${question.description ? question.description + '. ' : ''}${subq.description}`,
              size: 24, // docx size is in half-points
            }),
          ],
        })
      );
      subQuestionCounter++;

      if (subq.svg?.graph) {
        const pngGraphBlob = await convertSvgToPngBlob(subq.svg.graph);
        if (pngGraphBlob) {
          const buffer = await pngGraphBlob.arrayBuffer();
          paragraphs.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: buffer,
                  transformation: { width: 150, height: 150 },
                  type: "png",
                }),
              ],
            })
          );
        }
      }

      subq.options.forEach((option, i) => {
        const isCorrect = subq.answer === option ? "*" : "";
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${isCorrect}${String.fromCharCode(97 + i)}. ${option}`,
                size: 24,
              }),
            ],
          })
        );
      });

      if (subq.answer_svg?.graph) {
        const pngAnswerBlob = await convertSvgToPngBlob(subq.answer_svg.graph);
        if (pngAnswerBlob) {
          const buffer = await pngAnswerBlob.arrayBuffer();
          paragraphs.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: buffer,
                  transformation: { width: 150, height: 150 },
                  type: "png",
                }),
              ],
            })
          );
        }
      }
      paragraphs.push(new Paragraph({ text: "", spacing: { after: 100 } }));
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${assessmentDetails.title}_assessment.docx`);
};
