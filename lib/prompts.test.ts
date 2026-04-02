import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateUserPrompt } from './prompts';
import { StyleType } from './types';

describe('generateUserPrompt', () => {
  it('should generate a prompt containing the script and style', () => {
    const script = "This is a test script for a motion design brief.";
    const style: StyleType = "Commercial";

    const result = generateUserPrompt(script, style);

    // Check if the output string contains expected content
    assert.match(result, /Style: Commercial/);
    assert.match(result, /Script:\nThis is a test script for a motion design brief./);
    assert.match(result, /Generate the detailed motion design brief in JSON format./);
  });

  it('should handle different styles correctly', () => {
    const script = "Short explainer script.";
    const style: StyleType = "Explainer";

    const result = generateUserPrompt(script, style);

    assert.match(result, /Style: Explainer/);
    assert.match(result, /Script:\nShort explainer script./);
  });

  it('should handle empty scripts', () => {
    const script = "";
    const style: StyleType = "Social Media";

    const result = generateUserPrompt(script, style);

    assert.match(result, /Style: Social Media/);
    // Since there is an empty line between Script and Generate, and script is empty it matches \n\n\nGenerate
    assert.match(result, /Script:\n\n\nGenerate/);
  });

  it('should maintain the exact required structure', () => {
    const script = "Sample";
    const style: StyleType = "Corporate";

    const result = generateUserPrompt(script, style);

    const expected = `
Style: Corporate
Script:
Sample

Generate the detailed motion design brief in JSON format.
`;
    assert.equal(result, expected);
  });
});
