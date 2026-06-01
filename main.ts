/**
 * כלי מותאם אישית לשמירת נתונים בזיכרון הפנימי (Flash) עבור מיקרוביט
 */
//% color="#0d47a1" icon="\uf1c0" block="לוגר פלאש מותאם" weight=100
namespace CustomLogger {
    let separator = ","
    let filename = "log.txt"

    /**
     * מגדיר את שם הקובץ שבו יישמרו הנתונים בזיכרון הפנימי
     * @param name שם הקובץ הרצוי, eg: "data.txt"
     */
    //% block="הגדר שם קובץ לוג ל- $name"
    //% weight=95
    export function setFilename(name: string): void {
        filename = name;
    }

    /**
     * מגדיר את התו המפריד בין הנתונים
     * @param newSeparator התו המפריד המבוקש, eg: ","
     */
    //% block="הגדר מפריד נתונים ל- $newSeparator"
    //% weight=90
    export function setSeparator(newSeparator: string): void {
        separator = newSeparator;
    }

    /**
     * כתיבת שורת כותרת לקובץ (מומלץ להריץ פעם אחת ב-On Start)
     * @param keys רשימת שמות העמודות, eg: "Time,Temp,Light"
     */
    //% block="רשום כותרות עמודה בקובץ $keys"
    //% weight=80
    export function writeHeaders(keys: string): void {
        if (files.size(filename) == 0) {
            files.appendLine(filename, keys);
        }
    }

    /**
     * שמירת שורת נתונים ישירות לזיכרון ה-Flash של המיקרוביט
     * @param value1 נתון ראשון (למשל זמן או טמפרטורה), eg: 0
     * @param value2 נתון שני, eg: 0
     */
    //% block="שמור בזיכרון הפלאש: ערך א $value1 | ערך ב $value2"
    //% weight=70
    export function logData(value1: number, value2: number): void {
        let row = value1 + separator + value2;
        files.appendLine(filename, row);
    }

    /**
     * מחזיר חלק ממוקד מהנתונים בזיכרון כטקסט (בלוק עגול). אם הערכים 0, יוחזר כל הזיכרון.
     * @param fromCol עמודת התחלה (0 לכולן), eg: 0
     * @param toCol עמודת סיום (0 לכולן), eg: 0
     * @param fromRow שורת התחלה (0 לכולן), eg: 0
     * @param toRow שורת סיום (0 לכולן), eg: 0
     */
    //% block="תוכן הזיכרון: עמודות מ- $fromCol עד $toCol | שורות מ- $fromRow עד $toRow"
    //% inlineInputMode=inline
    //% weight=60
    export function readDataChunk(fromCol: number, toCol: number, fromRow: number, toRow: number): string {
        if (files.size(filename) == 0) {
            return "הקובץ ריק";
        }

        let fullContent = files.readString(filename);

        if (fromRow == 0 && toRow == 0 && fromCol == 0 && toCol == 0) {
            return fullContent;
        }

        let lines = fullContent.split("\n");
        let startRow = fromRow > 0 ? fromRow - 1 : 0;
        let endRow = toRow > 0 ? Math.min(toRow, lines.length) : lines.length;

        let resultResult = "";

        for (let i = startRow; i < endRow; i++) {
            let currentLine = lines[i].trim();
            if (currentLine.length == 0) continue;

            let columns = currentLine.split(separator);
            let startCol = fromCol > 0 ? fromCol - 1 : 0;
            let endCol = toCol > 0 ? Math.min(toCol, columns.length) : columns.length;

            let slicedColumns: string[] = [];
            for (let j = startCol; j < endCol; j++) {
                slicedColumns.push(columns[j]);
            }

            resultResult += slicedColumns.join(separator) + "\n";
        }

        return resultResult.trim();
    }

    /**
     * קריאת כל הנתונים השמורים והדפסתם למחשב (דרך ה-Serial)
     */
    //% block="שלח את כל הנתונים השמורים למחשב"
    //% weight=50
    export function dumpLogToSerial(): void {
        if (files.size(filename) > 0) {
            let content = files.readString(filename);
            serial.writeString(content);
        } else {
            serial.writeLine("הקובץ ריק או שלא קיים!");
        }
    }

    /**
     * מחיקה מוחלטת של קובץ הלוג מהזיכרון הפנימי
     */
    //% block="מחק לחלוטין את קובץ הלוג מהזיכרון"
    //% weight=40
    export function deleteLogFile(): void {
        files.remove(filename);
        serial.writeLine("קובץ הלוג נמחק בהצלחה!");
    }
}
