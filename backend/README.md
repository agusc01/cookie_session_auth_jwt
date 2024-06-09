### Identificar cuantos HttpsStatus se utilizan

```bash
 grep -ir 'res.status' | cut -d '(' -f 2 | cut -d ')' -f 1 | sort -n | uniq
```
