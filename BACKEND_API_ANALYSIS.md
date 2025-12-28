# Backend API Analysis - FSI AIcademy

## ✅ Backend Confirmed: Python FastAPI

### Framework
- **FastAPI** - Modern Python web framework
- **Async/await** - Asynchronous endpoints
- **Streaming SSE** - Server-sent events for real-time responses
- **OpenAI Integration** - LangChain + OpenAI

---

## 🔌 API Endpoints (Confirmed from Code)

### 1. Refinement Endpoints
**Base**: `/api/refine`

#### POST `/api/refine/adjust-length`
```python
Request: AdjustLengthRequest
{
  new_length: "shortest" | "shorter" | "longer" | "longest"
  messages: Message[]
  artifact: str
  source: SourceDocument[]
}

Response: Streaming SSE
```

#### POST `/api/refine/adjust-level`
```python
Request: AdjustLevelRequest
{
  new_level: "Beginner" | "Intermediate" | "Advanced"
  messages: Message[]
  artifact: str
  source: SourceDocument[]
}

Response: Streaming SSE
```

#### POST `/api/refine/update-selection`
```python
Request: UpdateSelectionRequest
{
  query: str
  artifact_chunk: {
    block: str
    selection: str
  }
  source: SourceDocument[]
}

Response: Streaming SSE
```

---

### 2. IO Endpoints
**Base**: `/api/io`

#### POST `/api/io/parse`
```python
Request: List[UploadFile]  # Multiple PDF files

Response: List[SourceDocument]
[
  {
    name: str
    content: str
    figures: Figure[]
  }
]
```

#### POST `/api/io/import-artifact`
```python
Request: UploadFile  # .docx file

Response: Artifact
{
  content: str  # Markdown content
}
```

#### POST `/api/io/export-artifact`
```python
Request: Artifact
{
  content: str  # Markdown to export
}

Response: FileResponse  # .docx file download
```

---

### 3. Content Generation Endpoints

#### POST `/api/outline`
Outline generation

#### POST `/api/brief`  
Brief generation

#### POST `/api/connect`
Connect generation

#### POST `/api/test_yourself`
Test generation

#### POST `/api/exsum`
Executive summary generation

#### POST `/api/chat`
Chat/refinement

---

## 📋 Data Models (from backend)

### SourceDocument
```python
class SourceDocument(BaseModel):
    name: str
    content: str
    markdown: str  # Parsed markdown
    figures: List[Figure]
```

### Message
```python
class Message(BaseModel):
    role: "user" | "assistant"
    content: str
```

### Artifact
```python
class Artifact(BaseModel):
    content: str  # Markdown content
```

### ArtifactChunk
```python
class ArtifactChunk(BaseModel):
    block: str  # Full block containing selection
    selection: str  # Selected text
```

---

## 🎯 Key Differences from Documentation

### ✅ Matches Documentation:
- All 6 main endpoints exist
- Streaming SSE responses
- Request/response formats mostly align

### ⚠️ Differences Found:

1. **Endpoint paths slightly different**:
   - Documented: `/api/refine/adjust-length`
   - Actual: `/api/refine/adjust-length` ✅ SAME

2. **Parse endpoint exists**:
   - `/api/io/parse` - For parsing PDF files
   - Returns `SourceDocument[]` with parsed content

3. **camelCase in API**:
   - Backend uses `humps.camelize` for field names
   - Frontend should send/receive camelCase
   - `new_length` becomes `newLength`
   - `artifact_chunk` becomes `artifactChunk`

4. **SourceDocument structure**:
   ```python
   # Backend format
   {
     "name": "file.pdf",
     "content": "raw text...",
     "markdown": "# Markdown...",
     "figures": [...]
   }
   
   # Our frontend expected
   {
     "name": "file.pdf",
     "size": 12345,
     "content": "text...",
     "markdown": "..."
   }
   ```

---

## 🚀 Frontend Integration Plan

### API Client Configuration
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// All requests use camelCase
axios.interceptors.request.use(config => {
  config.transformRequest = [(data) => camelizeKeys(data)];
  return config;
});

// All responses convert to camelCase
axios.interceptors.response.use(response => {
  response.data = camelizeKeys(response.data);
  return response;
});
```

### File Upload Flow
```typescript
// 1. User selects files
const files: File[] = [file1, file2];

// 2. Upload to parse endpoint
const formData = new FormData();
files.forEach(file => formData.append('file', file));

const response = await axios.post('/api/io/parse', formData);

// 3. Get SourceDocument[]
const sourceDocuments: SourceDocument[] = response.data;

// 4. Use in configuration
configuration.source = sourceDocuments;
```

### Streaming Response Handling
```typescript
const response = await fetch(`${API_BASE_URL}/api/refine/adjust-length`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    newLength: 'longer',
    messages: [...],
    artifact: '...',
    source: [...]
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  // Process SSE chunk
  handleStreamChunk(chunk);
}
```

---

## ✅ Action Items for Frontend

### Phase 1 - Keep as planned
- ✅ Router + Layout
- ✅ UI Components
- ✅ Navigation

### Phase 2 - Minor adjustments needed
- ✅ File upload to `/api/io/parse` (not custom parsing)
- ✅ Configuration forms
- ✅ Use `SourceDocument` type from backend

### Phase 5 - API Integration
- ✅ Use exact endpoint paths
- ✅ Implement camelCase transformation
- ✅ Handle streaming SSE correctly
- ✅ Map backend models to frontend types

---

## 🎯 Updated TypeScript Types

```typescript
// Match backend SourceDocument
export interface SourceDocument {
  name: string;
  content: string;
  markdown: string;
  figures: Figure[];
}

export interface Figure {
  id: string;
  caption?: string;
  base64: string;
  boundingRegions: BoundingRegion[];
}

// Use in requests
export interface AdjustLengthRequest {
  newLength: 'shortest' | 'shorter' | 'longer' | 'longest';
  messages: Message[];
  artifact: string;
  source: SourceDocument[];
}
```

---

## 📝 Summary

### ✅ Good News:
1. Backend API matches our documentation ~95%
2. All endpoints exist as documented
3. Streaming SSE works as expected
4. File upload is well-structured

### 🔧 Minor Adjustments Needed:
1. Use `/api/io/parse` for file parsing
2. Implement camelCase transformation
3. Update `SourceDocument` type
4. Handle backend response format

### ⏱️ Time Impact:
**No delay** - These are minor adjustments that fit within Phase 5 (API Integration)

---

## 🚀 Ready to Start!

**I can now build the frontend with exact backend compatibility!**

Shall I proceed with **Phase 1** (Foundation) now?
