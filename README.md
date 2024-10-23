# QuizItNow - Instant Quiz Generation from Any Content Source

**Tagline:** *Instant quiz generation from any content source.*

## Overview

**QuizItNow** is a powerful and flexible platform designed to automatically generate engaging and educational quizzes from a variety of input types, such as text, video, audio, PDFs, images, and online resources. Whether you're an educator, content creator, or learner, QuizItNow saves you time by streamlining the quiz creation process, ensuring high-quality assessments aligned with your desired difficulty level.

## Key Features

- **Supports Multiple Input Types**: Text, Video, Audio, PDFs, Images, and Online Resources.
- **Customizable Quiz Generation**: Specify the number of questions and choose from four difficulty levels: Easy, Medium, Hard, and God Mode.
- **AI-Powered Transcription & Processing**: Automatically transcribes and processes multimedia inputs such as videos and audio files.
- **Question Types**: Generates multiple formats including multiple-choice, true/false, fill-in-the-blank, and short-answer questions.
- **Error Handling**: Notifies users if input doesn’t meet the minimum requirements and provides guidance for adjustments.
- **Online Resource Support**: Input URLs for articles, videos, or podcasts for automated quiz generation.

## Table of Contents

- [Supported Input Types](#supported-input-types)
- [Quiz Generation Features](#quiz-generation-features)
- [Technologies Used](#technologies-used)
- [Challenges and Solutions](#challenges-and-solutions)
- [Getting Started](#getting-started)
- [License](#license)

## Supported Input Types

QuizItNow can generate quizzes from a variety of input types, making it versatile and adaptable for different user needs:

1. **Text**: Raw text input or uploaded text files.
2. **Video**: Uploaded video files or links (e.g., YouTube), which are transcribed and processed.
3. **Audio**: Uploaded audio files or links (e.g., podcasts), which are transcribed for quiz generation.
4. **PDF**: Uploaded PDF documents, converted into text for processing.
5. **Image**: Uploaded images (e.g., screenshots, diagrams) processed using Optical Character Recognition (OCR) to extract text.
6. **Online Resources**: Provide URLs to articles, videos, or podcasts; the platform extracts or transcribes the content for quiz creation.

## Quiz Generation Features

- **Number of Questions**: Users can specify the desired number of questions, based on input size:
  - Less than 500 words: Up to 5 questions
  - 500 - 1000 words: Up to 10 questions
  - 1000 - 1500 words: Up to 15 questions
  - 1500 - 2000 words: Up to 20 questions
  - More than 2000 words: Up to 25 questions
- **Difficulty Levels**: Choose from Easy, Medium, Hard, or God Mode (most challenging).
- **Adaptability**: Questions are generated based on the key themes, details, and complexities of the input.
- **Question Variety**: Generates various question types such as:
  - Multiple-choice
  - True/False
  - Fill-in-the-blank
  - Short-answer questions

## Technologies Used

### Backend
- **FastAPI**: Backend framework for building the API.
- **Ollama**: Large language model (LLM) processing.
- **Python**: Core programming language.
- **OpenAI Whisperer**: For audio and video transcription.

### Machine Learning
- **LLama LLMs**: Language models used for text processing and quiz generation.
- **Langchain**: Framework for connecting LLMs with data sources.

### Frontend
- **Next.js**: React-based web framework.
- **React**: JavaScript library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework.

### Database & Authentication
- **MongoDB**: NoSQL database for storing quiz data.
- **Auth.js**: Authentication system for managing user access.

### Version Control & Collaboration
- **GitHub**: For version control and collaboration.
- **Languages**: Python, TypeScript

## Challenges and Solutions

1. **Multimedia Input Transcription**: Transcribing noisy or low-quality audio was a challenge. We integrated a robust AI transcription service (OpenAI Whisperer) with advanced language models to ensure high accuracy, even in difficult audio conditions.
  
2. **Difficulty Calibration**: Aligning the generated questions with the desired difficulty level, especially for "God Mode," was a complex task. We iterated on our algorithms using feedback loops to fine-tune the difficulty calibration.

3. **GPU Infrastructure Limitations**: Processing large files and training models required significant computational power, and initially, the lack of adequate GPU infrastructure slowed development. We optimized the code and utilized smaller LLMs to overcome this challenge and speed up processing.

## Getting Started

### Prerequisites

- **Python 3.8+**
- **Node.js 14.x+**
- **MongoDB** (for storing quizzes and user data)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/QuizItNow.git
    cd QuizItNow
    ```

2. Install backend dependencies:

    ```bash
    pip install -r backend/requirements.txt
    ```

3. Install frontend dependencies:

    ```bash
    cd frontend
    npm install
    ```

4. Start the development server:

    ```bash
    npm run dev
    ```

5. Run the FastAPI backend:

    ```bash
    uvicorn backend.main:app --reload
    ```

### Usage

Once the app is running, you can start creating quizzes by providing various inputs (text, videos, PDFs, etc.) via the platform’s UI. Customize your quiz preferences, and let QuizItNow handle the rest!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Contributions are welcome! Please submit issues or pull requests to help improve **QuizItNow**.

Happy Quiz Building! 🎉