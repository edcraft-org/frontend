import { saveAs } from "file-saver";
import { AssessmentDetails } from "../../pages/AssessmentPages/AssessmentDetailsPage/AssessmentDetailsPage";

const SCALE_FACTOR = 0.6;

const convertSvgToPng = async (svgData: string): Promise<{ hex: string; width: number; height: number } | null> => {
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
          if (blob) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const byteArray = new Uint8Array(reader.result as ArrayBuffer);
              const hexString = Array.from(byteArray)
                .map((byte) => byte.toString(16).padStart(2, "0"))
                .join("");

              resolve({ hex: hexString, width, height });
            };
            reader.readAsArrayBuffer(blob);
          } else {
            resolve(null);
          }
        }, "image/png");
      }
      URL.revokeObjectURL(url);
    };

    img.src = url;
  });
};

export const generateRTF = async (assessmentDetails: AssessmentDetails) => {
  let rtfContent = "{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Arial;}}\n";
  let subQuestionCounter = 1;

  for (const question of assessmentDetails.questions) {
    // if (question.svg?.graph) {
    //   const pngGraphData = await convertSvgToPng(question.svg.graph);
    //   if (pngGraphData) {
    //     const picwgoal = pngGraphData.width * 15;
    //     const pichgoal = pngGraphData.height * 15;
    //     rtfContent += `{\\pict\\pngblip\\picwgoal${picwgoal}\\pichgoal${pichgoal}\n${pngGraphData.hex}}\n\\par\n`;
    //   }
    // }

    if (!question.subquestions) continue;

    for (const subq of question.subquestions) {
      rtfContent += `\\fs20 ${subQuestionCounter}. ${question.description ? question.description + '. ' : ''}${subq.description}\\par\n`;
      subQuestionCounter++;
      if (subq.svg?.graph) {
        const pngGraphData = await convertSvgToPng(subq.svg.graph);
        if (pngGraphData) {
          const picwgoal = pngGraphData.width * 15;
          const pichgoal = pngGraphData.height * 15;
          rtfContent += `{\\pict\\pngblip\\picwgoal${picwgoal}\\pichgoal${pichgoal}\n${pngGraphData.hex}}\n\\par\n`;
        }
      }

      if (subq.svg?.table) {
        const pngTableData = await convertSvgToPng(subq.svg.table);
        if (pngTableData) {
          const picwgoal = pngTableData.width * 15;
          const pichgoal = pngTableData.height * 15;
          rtfContent += `{\\pict\\pngblip\\picwgoal${picwgoal}\\pichgoal${pichgoal}\n${pngTableData.hex}}\n\\par\n`;
        }
      }

      subq.options.forEach((option, i) => {
        const isCorrect = subq.answer === option ? "*" : "";
        rtfContent += `\\fs20 ${isCorrect}${String.fromCharCode(97 + i)}. ${option}\\par\n`; // 97 is the ASCII code for 'a'
      });

      if (subq.answer_svg?.graph) {
        const pngData = await convertSvgToPng(subq.answer_svg.graph);
        if (pngData) {
          const picwgoal = pngData.width * 15;
          const pichgoal = pngData.height * 15;
          rtfContent += `{\\pict\\pngblip\\picwgoal${picwgoal}\\pichgoal${pichgoal}\n${pngData.hex}}\n\\par\n`;
        }
      }

      if (subq.answer_svg?.table) {
        const pngData = await convertSvgToPng(subq.answer_svg.table);
        if (pngData) {
          const picwgoal = pngData.width * 15;
          const pichgoal = pngData.height * 15;
          rtfContent += `{\\pict\\pngblip\\picwgoal${picwgoal}\\pichgoal${pichgoal}\n${pngData.hex}}\n\\par\n`;
        }
      }

      rtfContent += "\\par\n";
    }

    rtfContent += "\\par\n";
  }

  rtfContent += "}\n";

  const blob = new Blob([rtfContent], { type: "application/rtf" });
  saveAs(blob, `${assessmentDetails.title}_assessment.rtf`);
};