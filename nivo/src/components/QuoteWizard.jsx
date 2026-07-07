import { useState } from 'react';
import { quoteConfig, quoteSteps } from '../data/quoteContent';

const initialAnswers = quoteSteps.reduce((answers, step) => {
  answers[step.id] = step.options[0].value;
  return answers;
}, {});

function getOptionLabel(stepId, value) {
  const step = quoteSteps.find((item) => item.id === stepId);
  return step?.options.find((option) => option.value === value)?.label ?? value;
}

function calculateEstimate(answers) {
  const base = quoteConfig.basePrices[answers.space] ?? 0;
  const size = quoteConfig.sizeAdjustments[answers.size] ?? 0;
  const materials = quoteConfig.materialAdjustments[answers.materials] ?? 0;
  const discount = quoteConfig.frequencyDiscounts[answers.frequency] ?? 1;
  const estimate = Math.round((base + size + materials) * discount);

  return Math.max(25, estimate);
}

function buildWhatsappHref(answers, estimate) {
  const summary = [
    'Hola NIVO, quiero confirmar una cotización guiada.',
    `Tipo de espacio: ${getOptionLabel('space', answers.space)}`,
    `Tamaño: ${getOptionLabel('size', answers.size)}`,
    `Materiales: ${getOptionLabel('materials', answers.materials)}`,
    `Frecuencia: ${getOptionLabel('frequency', answers.frequency)}`,
    `Ciudad: ${answers.city}`,
    `Valor estimado: desde $${estimate}`,
  ].join('\n');

  return `${quoteConfig.whatsappBase}?text=${encodeURIComponent(summary)}`;
}

export default function QuoteWizard() {
  const [answers, setAnswers] = useState(initialAnswers);
  const estimate = calculateEstimate(answers);
  const whatsappHref = buildWhatsappHref(answers, estimate);

  function updateAnswer(stepId, value) {
    setAnswers((current) => ({
      ...current,
      [stepId]: value,
    }));
  }

  return (
    <div className="quote-wizard">
      <div className="quote-wizard__steps">
        {quoteSteps.map((step) => (
          <fieldset className="quote-step" key={step.id}>
            <legend>
              <span>{step.label}</span>
              {step.question}
            </legend>

            <div className="quote-options">
              {step.options.map((option) => (
                <label
                  className="quote-option"
                  data-active={answers[step.id] === option.value ? 'true' : 'false'}
                  key={option.value}
                >
                  <input
                    checked={answers[step.id] === option.value}
                    name={step.id}
                    onChange={() => updateAnswer(step.id, option.value)}
                    type="radio"
                    value={option.value}
                  />
                  <strong>{option.label}</strong>
                  <small>{option.detail}</small>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <aside className="quote-result" aria-live="polite">
        <span>Estimado inicial</span>
        <strong>desde ${estimate}</strong>
        <p>
          Este valor es una referencia. El precio final se confirma por WhatsApp
          según fotos, acceso, estado del espacio y alcance exacto.
        </p>
        <a className="quote-result__button" href={whatsappHref} target="_blank" rel="noreferrer">
          Enviar cotización
        </a>
      </aside>
    </div>
  );
}
