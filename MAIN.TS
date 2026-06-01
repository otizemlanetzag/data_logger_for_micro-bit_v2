/**
 * כלי מותאם אישית לשמירת נתונים (Data Logging) עבור מיקרוביט
 */
//% color="#1e88e5" icon="\uf1c0" block="לוגר נתונים" weight=100
namespace CustomLogger {
    let separator = ","
    let isHeaderWritten = false

    /**
     * מגדיר את התו המפריד בין הנתונים (למשל פסיק או נקודה-פסיק)
     * @param newSeparator התו המפריד המבוקש, eg: ","
     */
    //% block="הגדר מפריד נתונים ל- $newSeparator"
    //% weight=90
    export function setSeparator(newSeparator: string): void {
        separator = newSeparator;
    }

    /**
     * כתיבת שורת כותרת (Headers) עבור קובץ הנתונים. מומלץ להריץ פעם אחת בבלוק On Start.
     * @param keys רשימת שמות העמודות, eg: "Time,Temp,Light"
     */
    //% block="רשום כותרות עמודה $keys"
    //% weight=80
    export function writeHeaders(keys: string): void {
        if (!isHeaderWritten) {
            serial.writeLine(keys);
            isHeaderWritten = true;
        }
    }

    /**
     * שמירת שורת נתונים חדשה (רשומה) בלוג
     * @param value1 נתון ראשון (למשל זמן או טמפרטורה), eg: 0
     * @param value2 נתון שני, eg: 0
     */
    //% block="רשום נתונים בלוג: ערך א $value1 | ערך ב $value2"
    //% weight=70
    export function logData(value1: number, value2: number): void {
        // שילוב הערכים לשורה אחת עם התו המפריד והדפסה לחיבור הטורי (Serial)
        let row = value1 + separator + value2;
        serial.writeLine(row);
    }

    /**
     * מחיקת כל הנתונים ואיפוס סטטוס הלוגר
     */
    //% block="אפס ומחק את לוג הנתונים"
    //% weight=60
    export function clearLog(): void {
        isHeaderWritten = false;
        // כאן תוכל להוסיף לוגיקה למחיקת קבצים אם תרצה להרחיב את הקוד בעתיד
        serial.writeLine("--- LOG RESET ---");
    }
}
