# CMS DocuFrontend

Un sistema de gestión de contenido (CMS) moderno construido con React, TypeScript y Vite, diseñado para administrar contenido, proyectos, categorías y documentación de manera eficiente.

## 🚀 Características Principales

### 📝 Gestión de Contenido
- **Crear, editar, ver y eliminar contenido** con editor de texto enriquecido TinyMCE
- **Categorías y subcategorías** con sistema de prioridades
- **Etiquetas y estados** (borrador, publicado, archivado)
- **Sistema de prioridades** para ordenamiento inteligente
- **Historial de cambios** con seguimiento de modificaciones

### 📁 Gestión de Proyectos
- **Crear y gestionar proyectos** con descripción, objetivos y conclusiones
- **Estados de proyecto** configurables (en progreso, completado, etc.)
- **Áreas de proyecto** para organización por departamentos
- **Sistema de prioridades** para proyectos
- **Editor de texto enriquecido** para descripciones y objetivos
- **Filtros y búsqueda** avanzada de proyectos

### 👥 Sistema de Autenticación
- **Login con email y contraseña**
- **Roles de usuario** (admin, creator)
- **JWT tokens** para autenticación segura
- **Gestión de sesiones** automática
- **Administración de usuarios** (solo para admins)
  - Crear, editar y eliminar usuarios
  - Asignar roles (admin, creator)
  - Gestión de contraseñas

### 📚 Documentación
- **Visualización de contenido** organizado por categorías
- **Navegación lateral** con lista de títulos
- **Contenido enriquecido** con formato HTML
- **Responsive design** para todos los dispositivos

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Bootstrap 5 + Bootstrap Icons
- **Editor de Texto**: TinyMCE 6
- **Estado**: React Hooks
- **HTTP Client**: Fetch API con interceptores
- **Autenticación**: JWT tokens

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd docu-frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env.local
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_TINYMCE_API_KEY=your-tinymce-api-key
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Construir para producción**
   ```bash
   npm run build
   ```

## 🔧 Configuración

### API Backend
El frontend se conecta a un backend API que debe estar ejecutándose en `http://localhost:3000/api`. El backend debe proporcionar los siguientes endpoints:

#### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario

#### Contenido
- `GET /content` - Listar contenido
- `POST /content` - Crear contenido
- `GET /content/{id}` - Obtener contenido
- `PATCH /content/{id}` - Actualizar contenido
- `DELETE /content/{id}` - Eliminar contenido

#### Proyectos
- `GET /projects` - Listar proyectos
- `POST /projects` - Crear proyecto
- `GET /projects/{id}` - Obtener proyecto
- `PATCH /projects/{id}` - Actualizar proyecto
- `DELETE /projects/{id}` - Eliminar proyecto

#### Categorías y Subcategorías
- `GET /categories/public` - Categorías activas
- `GET /subcategories/public` - Subcategorías activas

#### Estados y Áreas de Proyecto
- `GET /project-statuses/public` - Estados activos
- `GET /project-areas/public` - Áreas activas

### TinyMCE
Para usar el editor de texto enriquecido, necesitas una API key de TinyMCE. Puedes obtener una gratuita en [TinyMCE](https://www.tiny.cloud/).

## 📱 Uso

### Gestión de Contenido
1. **Navegar a "Contenido"** en el menú principal
2. **Crear nuevo contenido** con el botón "Nuevo Contenido"
3. **Completar el formulario** con título, descripción, categoría, etc.
4. **Usar el editor TinyMCE** para contenido enriquecido
5. **Guardar y gestionar** el contenido creado

### Gestión de Proyectos
1. **Navegar a "Proyectos"** en el menú principal
2. **Crear nuevo proyecto** con el botón "Nuevo Proyecto"
3. **Completar información** del proyecto:
   - Título y descripción
   - Estado y área del proyecto
   - Objetivos específicos
   - Conclusión (opcional)
4. **Usar filtros y búsqueda** para encontrar proyectos
5. **Gestionar proyectos** existentes

### Gestión de Usuarios (Solo Admins)
1. **Navegar a "Usuarios"** en el menú principal (solo visible para admins)
2. **Crear nuevo usuario** con el botón "Nuevo Usuario"
3. **Completar información** del usuario:
   - Nombre completo
   - Email válido
   - Contraseña segura
   - Rol (admin o creator)
4. **Usar filtros y búsqueda** para encontrar usuarios
5. **Editar o eliminar** usuarios existentes
6. **Gestionar roles** y permisos de acceso

### Documentación
1. **Navegar a "Documentación"** en el menú principal
2. **Explorar contenido** organizado por categorías
3. **Usar la navegación lateral** para saltar a secciones específicas
4. **Leer contenido** con formato enriquecido

## 🎨 Características de la UI

### Diseño Responsive
- **Mobile-first** design
- **Sidebars fijas** para navegación
- **Contenedores fluidos** para máximo ancho
- **Adaptación automática** a diferentes tamaños de pantalla

### Componentes Interactivos
- **Filtros avanzados** para contenido y proyectos
- **Búsqueda en tiempo real**
- **Ordenamiento** por múltiples criterios
- **Estados de carga** y feedback visual
- **Confirmaciones** para acciones destructivas

### Editor de Texto Enriquecido
- **TinyMCE 6** con múltiples plugins
- **Formato de texto** completo
- **Inserción de medios** (imágenes, enlaces)
- **Tablas y listas**
- **Vista previa** en tiempo real

## 🔒 Seguridad

- **Autenticación JWT** con tokens seguros
- **Interceptores HTTP** para manejo automático de tokens
- **Validación de formularios** en frontend y backend
- **Manejo de errores** robusto
- **Roles y permisos** basados en usuario

## 📊 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── ContentList.tsx  # Lista de contenido
│   ├── ContentForm.tsx  # Formulario de contenido
│   ├── ProjectList.tsx  # Lista de proyectos
│   ├── ProjectForm.tsx  # Formulario de proyectos
│   ├── Documentation.tsx # Página de documentación
│   ├── Navigation.tsx   # Navegación principal
│   ├── Login.tsx        # Página de login
│   ├── Users.tsx        # Página de gestión de usuarios
│   ├── UserList.tsx     # Lista de usuarios
│   ├── UserForm.tsx     # Formulario de usuarios
│   └── TinyMCE.tsx      # Editor de texto
├── hooks/               # Custom hooks
│   ├── useAuth.ts       # Autenticación
│   ├── useContentManager.ts # Gestión de contenido
│   ├── useCategories.ts # Categorías
│   ├── useProjects.ts   # Gestión de proyectos
│   └── useUsers.ts      # Gestión de usuarios
├── services/            # Servicios API
│   ├── api.ts           # API principal
│   └── projectApi.ts    # API de proyectos
├── types/               # Tipos TypeScript
│   └── index.ts         # Definiciones de tipos
├── config/              # Configuración
│   └── api.ts           # Configuración de API
└── App.tsx              # Componente principal
```

## 🚀 Despliegue

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm run preview
```

### Variables de Entorno
```bash
# .env.local
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_TINYMCE_API_KEY=your-tinymce-api-key
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico o preguntas:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo
- Revisar la documentación de la API

---

**Desarrollado con ❤️ usando React, TypeScript y Vite**
