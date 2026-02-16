// Operadores de Google Dork (versión ampliada para hacking ético)
const operators = [
    {
        name: 'intitle:',
        description: 'Busca páginas que contengan las palabras especificadas en el título',
        example: 'intitle:"admin panel"',
        syntax: 'intitle:término',
        usage: 'Útil para encontrar páginas específicas por su título'
    },
    {
        name: 'allintitle:',
        description: 'Busca páginas que contengan todas las palabras especificadas en el título',
        example: 'allintitle:admin panel login',
        syntax: 'allintitle:término1 término2',
        usage: 'Todas las palabras deben estar en el título'
    },
    {
        name: 'inurl:',
        description: 'Busca páginas que contengan las palabras especificadas en la URL',
        example: 'inurl:login',
        syntax: 'inurl:término',
        usage: 'Excelente para encontrar páginas de administración o directorios específicos'
    },
    {
        name: 'allinurl:',
        description: 'Busca páginas que contengan todas las palabras especificadas en la URL',
        example: 'allinurl:admin login',
        syntax: 'allinurl:término1 término2',
        usage: 'Todas las palabras deben estar en la URL'
    },
    {
        name: 'site:',
        description: 'Limita los resultados a un sitio web específico',
        example: 'site:github.com',
        syntax: 'site:dominio.com',
        usage: 'Restringe la búsqueda a un dominio particular'
    },
    {
        name: 'filetype:',
        description: 'Busca archivos de un tipo específico',
        example: 'filetype:pdf',
        syntax: 'filetype:extensión',
        usage: 'Encuentra documentos PDF, DOC, XLS, PPT, etc.'
    },
    {
        name: 'ext:',
        description: 'Alias de filetype:',
        example: 'ext:xls',
        syntax: 'ext:extensión',
        usage: 'Útil para buscar archivos por extensión'
    },
    {
        name: 'intext:',
        description: 'Busca páginas que contengan las palabras especificadas en el contenido',
        example: 'intext:"confidential"',
        syntax: 'intext:término',
        usage: 'Busca en el contenido de las páginas web'
    },
    {
        name: 'allintext:',
        description: 'Busca páginas que contengan todas las palabras especificadas en el contenido',
        example: 'allintext:password username',
        syntax: 'allintext:término1 término2',
        usage: 'Todas las palabras deben estar en el contenido'
    },
    {
        name: 'cache:',
        description: 'Muestra la versión en caché de una página web',
        example: 'cache:example.com',
        syntax: 'cache:url',
        usage: 'Ver versiones anteriores de páginas web'
    },
    {
        name: 'related:',
        description: 'Encuentra sitios web relacionados con una URL específica',
        example: 'related:github.com',
        syntax: 'related:url',
        usage: 'Descubre sitios similares'
    },
    {
        name: 'link:',
        description: 'Encuentra páginas que enlazan a una URL específica',
        example: 'link:example.com',
        syntax: 'link:url',
        usage: 'Ver qué páginas enlazan a un sitio'
    },
    {
        name: 'info:',
        description: 'Muestra información sobre una página',
        example: 'info:example.com',
        syntax: 'info:url',
        usage: 'Ver detalles que Google tiene de un sitio'
    },
    {
        name: 'define:',
        description: 'Busca definiciones de palabras',
        example: 'define:pentesting',
        syntax: 'define:palabra',
        usage: 'Rápidamente ver definiciones'
    },
    {
        name: 'maps:',
        description: 'Realiza búsquedas directamente en Google Maps',
        example: 'maps:"cafetería Madrid"',
        syntax: 'maps:término',
        usage: 'Busca ubicaciones directamente en Maps'
    },
    {
        name: 'before:',
        description: 'Busca resultados publicados antes de una fecha',
        example: 'breach before:2022-01-01',
        syntax: 'término before:YYYY-MM-DD',
        usage: 'Restringe los resultados a fechas anteriores'
    },
    {
        name: 'after:',
        description: 'Busca resultados publicados después de una fecha',
        example: 'ransomware after:2023-01-01',
        syntax: 'término after:YYYY-MM-DD',
        usage: 'Restringe los resultados a fechas posteriores'
    },
    {
        name: 'AROUND(X)',
        description: 'Encuentra páginas donde dos términos están cerca uno del otro',
        example: '"sql" AROUND(5) "injection"',
        syntax: 'término1 AROUND(n) término2',
        usage: 'Muy útil para encontrar contexto relacionado'
    },
    {
        name: '"palabra"',
        description: 'Búsqueda exacta de una frase',
        example: '"confidential report"',
        syntax: '"frase exacta"',
        usage: 'Útil para resultados precisos'
    },
    {
        name: '-palabra',
        description: 'Excluye un término de la búsqueda',
        example: 'admin -site:example.com',
        syntax: 'término -excluir',
        usage: 'Sirve para filtrar resultados irrelevantes'
    },
    {
        name: 'OR',
        description: 'Busca resultados que contengan uno u otro término',
        example: 'hacking OR pentesting',
        syntax: 'término1 OR término2',
        usage: 'Útil para ampliar la búsqueda a sinónimos'
    },
    {
        name: '*',
        description: 'Comodín para cualquier palabra',
        example: '"file * password"',
        syntax: '"frase * frase"',
        usage: 'Útil cuando no recuerdas parte de la frase'
    },
    {
        name: '..',
        description: 'Busca dentro de un rango de números',
        example: 'camera $50..$200',
        syntax: 'número1..número2',
        usage: 'Buscar en intervalos de fechas, precios, etc.'
    }
];