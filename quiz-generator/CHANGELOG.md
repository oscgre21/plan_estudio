# Changelog - Quiz Generator

## [1.1.0] - Increased Question Generation

### Changed
- **Vocabulary Generator**: Now generates 30-40 words (previously 10-20)
  - Updated prompt to request 30-40 items
  - Increased `num_predict` from 6000 to 12000 tokens
  - Added warning if less than 30 words are generated

- **Definition Quiz Generator**: Now generates 30-40 questions (previously 10-20)
  - Updated prompt to request 30-40 items
  - Increased `num_predict` from 6000 to 12000 tokens
  - Added warning if less than 30 questions are generated

- **Science Quiz Generator**: Now generates 30-50 questions (previously 20-40)
  - Updated prompt to request 30-50 items
  - Increased `num_predict` from 8000 to 16000 tokens
  - Added warning if less than 30 questions are generated

### Technical Details

**Files Modified:**

1. `prompts/vocabulary-prompt.txt`
   - Line 7: Changed "10-20" to "30-40"

2. `prompts/definition-quiz-prompt.txt`
   - Line 7: Changed "10-20" to "30-40"

3. `prompts/science-quiz-prompt.txt`
   - Line 9: Changed "20-40" to "30-50"

4. `generators/vocabulary-generator.js`
   - Line 26: Increased `num_predict` to 12000
   - Lines 32-36: Added validation warning

5. `generators/definition-quiz-generator.js`
   - Line 26: Increased `num_predict` to 12000
   - Lines 32-36: Added validation warning

6. `generators/science-quiz-generator.js`
   - Line 27: Increased `num_predict` to 16000
   - Lines 33-37: Added validation warning

### Impact

- **Generation Time**: Will take approximately 20-30% longer due to more content
- **Token Usage**: Approximately 2x more tokens per generation
- **Quality**: More comprehensive coverage of study material
- **Document Requirements**: Larger documents (3000+ words) recommended for best results

### Recommendations

For optimal results with increased generation:

1. Use documents with at least 3000-5000 words
2. Ensure Ollama has sufficient RAM (8GB+ recommended)
3. Monitor the warnings - if consistently getting less than 30 items, the document may be too small
4. Consider using `--skip-audio` for faster testing iterations

### Example Output

**Before (typical):**
- Vocabulary: 12-15 words
- Definition Quiz: 15-18 questions
- Science Quiz: 25-30 questions

**After (expected):**
- Vocabulary: 30-40 words ✅
- Definition Quiz: 30-40 questions ✅
- Science Quiz: 30-50 questions ✅

### Backward Compatibility

✅ Fully backward compatible - existing scripts and workflows continue to work
✅ Only the generation counts have changed
✅ File formats remain the same
✅ No breaking changes to the API

---

## [1.0.0] - Initial Release

Initial release with basic quiz generation functionality.
