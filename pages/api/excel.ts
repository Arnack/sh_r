import { NextApiRequest, NextApiResponse } from 'next';
import * as ExcelJS from 'exceljs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { data, settings } = req.body;
    
    console.log('Received settings:', settings);
    console.log('Header color:', settings.headerColor);
    
    // Fix color format - ensure it has FF prefix for full opacity
    const headerColor = settings.headerColor.replace('#', '');
    const headerColorWithAlpha = headerColor.length === 6 ? `FF${headerColor}` : headerColor;
    
    const alternateColor = settings.alternateColor.replace('#', '');
    const alternateColorWithAlpha = alternateColor.length === 6 ? `FF${alternateColor}` : alternateColor;
    
    console.log('Processed header color:', headerColorWithAlpha);
    console.log('Processed alternate color:', alternateColorWithAlpha);

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Судебная деятельность');

    // Set column headers and widths
    worksheet.columns = [
      { header: 'Начало', key: 'nachalo', width: 12 },
      { header: 'Код Проекта', key: 'code', width: 15 },
      { header: 'Вид Деятельности', key: 'vidDeyatelnosti', width: 20 },
      { header: 'Тема', key: 'tema', width: 40 },
      { header: 'Длительность', key: 'dlitelnost', width: 12 },
      { header: 'Округление', key: 'okruglenie', width: 12 }
    ];

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: headerColorWithAlpha }
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' },
        size: 12
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
    });

    // Add data
    data.forEach((item: any, index: number) => {
      const row = worksheet.addRow({
        nachalo: item.nachalo,
        code: item.code,
        vidDeyatelnosti: item.vidDeyatelnosti,
        tema: item.tema,
        dlitelnost: item.dlitelnost,
        okruglenie: item.okruglenie
      });

      // Apply alternating row colors
      if (settings.alternateRows && index % 2 === 1) {
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: alternateColorWithAlpha }
          };
        });
      }

      // Apply number formatting
      if (settings.numberFormat) {
        const dlitelnostCell = row.getCell('dlitelnost');
        const okruglenieCell = row.getCell('okruglenie');
        dlitelnostCell.numFmt = '#,##0';
        okruglenieCell.numFmt = '#,##0';
      }
    });

    // Apply borders if enabled
    if (settings.borders) {
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } }
          };
        });
      });
    }

    // Write to buffer
    const buffer = await workbook.xlsx.writeBuffer();
    
    console.log('Excel file generated successfully');
    
    // Set headers
    res.setHeader('Content-Disposition', 'attachment; filename=судебная_деятельность.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
    // Send buffer
    res.send(buffer);
  } catch (error) {
    console.error('Error generating Excel file:', error);
    res.status(500).json({ message: 'Error generating Excel file' });
  }
} 