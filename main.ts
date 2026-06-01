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
        // אם הקובץ לא קיים או ריק, נכתוב את הכותרת בראשו
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
        // כתיבת השורה לתוך הקובץ הפנימי במיקרוביט
        files.appendLine(filename, row);
    }

    /**
     * קריאת כל הנתונים השמורים והדפסתם למחשב (דרך ה-Serial)
     */
    //% block="שלח את כל הנתונים השמורים למחשב"
    //% weight=60
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
    //% weight=50
    export function deleteLogFile(): void {
        files.remove(filename);
        serial.writeLine("קובץ הלוג נמחק בהצלחה!");
    }
}
