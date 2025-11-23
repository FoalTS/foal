---
title: Introducción
slug: /
---

## ¿Qué es Foal?

*Foal* (o *FoalTS*) es un framework Node.JS para crear aplicaciones web.

Proporciona un conjunto de componentes listos para usar, de modo que no tenga que reinventar la rueda cada vez. En un solo lugar, tiene un entorno completo para construir aplicaciones web. Esto incluye una CLI, herramientas de prueba, utilidades frontales, scripts, autenticación avanzada, ORM, entornos de despliegue, API GraphQL y Swagger, utilidades AWS, y mucho más. Ya no necesita perderse en npm buscando paquetes y haciendo que funcionen juntos. Todo está previsto.

Pero a la vez que ofrece todas estas características, el framework sigue siendo sencillo. La complejidad y las abstracciones innecesarias se dejan de lado para proporcionar la sintaxis más intuitiva y expresiva. Creemos que un código conciso y elegante es la mejor manera de desarrollar una aplicación y mantenerla en el futuro. También le permite dedicar más tiempo a la codificación en lugar de intentar comprender cómo funciona el framework.

Y por último, el framework está enteramente escrito en TypeScript. Este lenguaje le aporta una comprobación de tipos estática opcional junto con las últimas características de ECMAScript. Esto le permite detectar la mayoría de los errores tontos durante la compilación y mejorar la calidad de su código. También le ofrece autocompletado y una API bien documentada.

## Política de Desarrollo

### Miles de Pruebas

Las pruebas de FoalTS tienen una prioridad muy alta. Proporcionar un producto fiable es realmente importante para nosotros. En diciembre de 2020, el framework está cubierto por más de 2100 pruebas.

### Documentación

Las nuevas características, independientemente de lo que ofrezcan, no sirven de nada si no están bien documentadas. Mantener una documentación completa y de calidad es clave para el framework. Si cree que falta algo o no está claro, ¡no dude en abrir una issue en Github!

### Estabilidad del Producto

Se presta gran atención a la estabilidad del producto. Puede obtener más información consultando nuestras [política de dependencia](https://github.com/FoalTS/foal/blob/master/.github/CONTRIBUTING.MD#dependency-policy), [reglas de versionado semántico](https://github.com/FoalTS/foal/blob/master/.github/CONTRIBUTING.MD#semantic-versioning) y [política de soporte a largo plazo](https://github.com/FoalTS/foal/blob/master/.github/CONTRIBUTING.MD#long-term-support-policy-and-schedule).

## Empezar

```
> npm install -g @foal/cli
> foal createapp my-app
> cd my-app
> npm run dev
```

¡El servidor de desarrollo ha comenzado! ¡Vaya a `http://localhost:3001` y encuentre nuestra página de bienvenida!

👉 [Continuar con el tutorial](./tutorials/simple-todo-list/1-installation) 🌱