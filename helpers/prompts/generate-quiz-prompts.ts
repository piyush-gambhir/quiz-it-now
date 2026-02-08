export const generateQuizFormTextPrompt = (
    text: string,
    numberOfQuestions: number,
    difficulty: string,
): string => {
    return `
      You are an AI assistant specialized in creating educational content. Your task is to generate a single, well-structured JSON object for a quiz based on the provided input text.
  
      **Instructions:**
  
      - **Quiz Generation**:
          - Generate a quiz with **exactly ${numberOfQuestions}** questions.
          - The questions should be based on the **key themes, details, and complexities** of the input text.
          - **Question Types**: Include a mix of the following question types:
              - **Multiple-choice (MCQ)**: One correct answer and three plausible distractors (total of four options).
              - **True/False**: Statements that are either true or false, with options "True" and "False".
              - **Fill-in-the-Blank**: Sentences with a missing word or phrase, provided with four options to choose from.
      - **Difficulty Level**:
          - The quiz should match the selected difficulty level: **${difficulty}**.
              - **Easy**: Basic facts and straightforward concepts.
              - **Medium**: Detailed understanding and slight inference.
              - **Hard**: Deep understanding and critical thinking.
              - **God Mode**: Complex analysis and synthesis of ideas.
      - **Metadata**:
          - Include the following at the top level of the JSON:
              - \`"title"\`: A concise, generated title based on the input content.
              - \`"description"\`: A brief description generated from the input content.
              - \`"difficulty"\`: The selected difficulty level ("${difficulty}").
              - \`"topic"\`: The main topic or subject area of the input content.
              - \`"tags"\`: A list of relevant tags related to the input content.
              - \`"questions"\`: An array containing the generated questions.
  
      **Rules:**
  
      - **Number of Questions**:
          - Use the **number of questions specified by the user**: **${numberOfQuestions}**.
          - Do not exceed this number, even if the input text is long.
      - **Input Length Validation**:
          - If the input text is **under 500 words**, do not generate a quiz. Instead, return the following JSON:
          {"error": "Input text must be at least 500 words to generate a quiz."}
      - **Question Structure**:
          - Each question should include:
              - \`"type"\`: One of \`"multiple-choice"\`, \`"true/false"\`, \`"fill-in-the-blank"\`.
              - \`"question"\`: The text of the question.
              - \`"options"\`: A list of options:
                  - **For MCQ and Fill-in-the-Blank**: Four options to choose from.
                  - **For True/False**: ["True", "False"].
              - \`"answer"\`: The correct answer text (must match one of the options).
              - \`"explanation"\`: A brief explanation for the answer.
              - \`"tags"\`: Relevant tags for the question.
      - **Output Format**:
          - **Return only a single JSON object** that encapsulates all metadata and questions.
          - The JSON structure should be as follows:
          {
              "title": "Generated Title",
              "description": "Generated Description",
              "difficulty": "Medium",
              "topic": "Main Topic",
              "tags": ["Tag1", "Tag2"],
              "questions": [
                  {
                      "type": "multiple-choice",
                      "question": "Question 1?",
                      "options": ["Option A", "Option B", "Option C", "Option D"],
                      "answer": "Option A",
                      "explanation": "Explanation for Option A.",
                      "tags": ["Tag1"]
                  },
                  ...
              ]
          }
          - Ensure the JSON is **valid** and properly formatted.
          - **Do not include any text outside of the JSON format.**
          - **Do not include multiple JSON objects or any additional text. Ensure that all questions are contained within the "questions" array of the JSON object.**
  
      **Input Text:**
  
      ${text}
  
      **Output only valid JSON. Do not include multiple JSON objects or any additional text. Ensure that all questions are contained within the "questions" array of the JSON object.**
    `;
};

export const generateQuizFromTranscriptPrompt = (
    transcript: string,
    numberOfQuestions: number,
    difficulty: string,
): string => {
    return `
        You are an AI assistant specialized in creating educational content. Your task is to generate a well-structured JSON object for a quiz based on the provided transcript.
  
        **Instructions:**
  
        - **Transcript Processing**:
            - Analyze the provided transcript to extract the key points, ideas, and themes.
            - Remove any filler words, repetitive phrases, or irrelevant dialogue, keeping only the meaningful content.
            - Ensure the extracted content reflects the main discussion, concepts, and topics covered in the transcript.
  
        - **Quiz Generation**:
            - Generate a quiz with **exactly ${numberOfQuestions}** questions based on the extracted content.
            - The questions should focus on the **key themes, details, and complexities** of the transcript.
            - **Question Types**: Include a mix of the following question types:
                - **Multiple-choice (MCQ)**: One correct answer and three plausible distractors (total of four options).
                - **True/False**: Statements that are either true or false, with options "True" and "False".
                - **Fill-in-the-Blank**: Sentences with a missing word or phrase, provided with four options to choose from.
  
        - **Difficulty Level**:
            - The quiz should match the selected difficulty level: **${difficulty}**.
                - **Easy**: Basic facts and straightforward concepts.
                - **Medium**: Detailed understanding and slight inference.
                - **Hard**: Deep understanding and critical thinking.
                - **God Mode**: Complex analysis and synthesis of ideas.
  
        - **Metadata**:
            - Include the following at the top level of the JSON:
                - \`"title"\`: A concise, generated title based on the content of the transcript.
                - \`"description"\`: A brief description generated from the key points of the transcript.
                - \`"difficulty"\`: The selected difficulty level ("${difficulty}").
                - \`"topic"\`: The main topic or subject discussed in the transcript.
                - \`"tags"\`: A list of relevant tags related to the content of the transcript.
                - \`"questions"\`: An array containing the generated questions.
  
        **Rules:**
  
        - **Number of Questions**:
            - Use the **number of questions specified by the user**: **${numberOfQuestions}**.
            - Do not exceed this number, even if the transcript is long or detailed.
  
        - **Input Length Validation**:
            - If the extracted content from the transcript is **under 500 words**, do not generate a quiz. Instead, return the following JSON:
            {"error": "Extracted content must be at least 500 words to generate a quiz."}
  
        - **Question Structure**:
            - Each question should include:
                - \`"type"\`: One of \`"multiple-choice"\`, \`"true/false"\`, \`"fill-in-the-blank"\`.
                - \`"question"\`: The text of the question.
                - \`"options"\`: A list of options:
                    - **For MCQ and Fill-in-the-Blank**: Four options to choose from.
                    - **For True/False**: ["True", "False"].
                - \`"answer"\`: The correct answer text (must match one of the options).
                - \`"explanation"\`: A brief explanation for the answer.
                - \`"tags"\`: Relevant tags for the question.
  
        - **Output Format**:
            - **Return only a single JSON object** that encapsulates all metadata and questions.
            - The JSON structure should be as follows:
            {
                "title": "Generated Title",
                "description": "Generated Description",
                "difficulty": "Medium",
                "topic": "Main Topic",
                "tags": ["Tag1", "Tag2"],
                "questions": [
                    {
                        "type": "multiple-choice",
                        "question": "Question 1?",
                        "options": ["Option A", "Option B", "Option C", "Option D"],
                        "answer": "Option A",
                        "explanation": "Explanation for Option A.",
                        "tags": ["Tag1"]
                    },
                    ...
                ]
            }
            - Ensure the JSON is **valid** and properly formatted.
            - **Do not include any text outside of the JSON format**.
            - **Do not include multiple JSON objects** or any additional text. Ensure that all questions are contained within the "questions" array of the JSON object.
  
        **Transcript:**
  
        ${transcript}
  
        **Output only valid JSON. Do not include multiple JSON objects or any additional text. Ensure that all questions are contained within the "questions" array of the JSON object.**
    `;
};
