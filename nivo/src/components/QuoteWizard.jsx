import { useMemo, useState } from 'react';
import {
  businessCounters,
  businessServiceTypes,
  cityOptions,
  conditionOptions,
  delicateSurfaceOptions,
  extraOptions,
  frequencyOptions,
  getCityOption,
  getConditionOption,
  getDelicateSurfaceOption,
  getExtraOption,
  getMaterialOption,
  getServiceType,
  getSizeOption,
  getUrgencyOption,
  materialOptions,
  moveOutCounters,
  petCounters,
  postConstructionCounters,
  quoteConfig,
  residentialCounters,
  serviceTypes,
  sizeOptions,
  urgencyOptions,
} from '../data/quoteContent';

const singleQuantityExtras = new Set([
  'heavyGrease',
  'highDust',
  'lightTrash',
  'odorDetail',
  'delicateSurfaces',
  'difficultAccess',
]);

const quoteFlow = [
  {
    eyebrow: 'Paso 1 de 7',
    title: 'Elige tu espacio',
    description: 'Toca una tarjeta y presiona Continuar.',
  },
  {
    eyebrow: 'Paso 2 de 7',
    title: 'Cuenta los ambientes',
    description: 'Usa + y - para ajustar cantidades.',
  },
  {
    eyebrow: 'Paso 3 de 7',
    title: 'Define el alcance',
    description: 'Selecciona tamaño, estado actual y frecuencia.',
  },
  {
    eyebrow: 'Paso 4 de 7',
    title: 'Detalles de la visita',
    description: 'Indica materiales, mascotas y fecha deseada.',
  },
  {
    eyebrow: 'Paso 5 de 7',
    title: 'Extras',
    description: 'Agrega solo lo que necesitas.',
  },
  {
    eyebrow: 'Paso 6 de 7',
    title: 'Ubicación',
    description: 'Indica ciudad, sector y cualquier dato importante.',
  },
  {
    eyebrow: 'Resultado',
    title: 'Valor calculado',
    description: 'Envía el resumen por WhatsApp para coordinar la visita.',
  },
];

function buildInitialCounts() {
  const counters = [
    ...residentialCounters,
    ...moveOutCounters,
    ...postConstructionCounters,
    ...businessCounters,
    ...petCounters,
  ];

  return counters.reduce((accumulator, counter) => {
    accumulator[counter.id] = counter.defaultValue ?? 0;
    return accumulator;
  }, {});
}

function getInitialAnswers() {
  return {
    serviceType: serviceTypes[0].value,
    size: sizeOptions[1].value,
    condition: conditionOptions[1].value,
    frequency: frequencyOptions[0].value,
    materials: materialOptions[1].value,
    urgency: urgencyOptions[0].value,
    city: cityOptions[0].value,
    delicateSurface: delicateSurfaceOptions[0].value,
    delicateSurfaceOther: '',
    sector: '',
    notes: '',
    counts: buildInitialCounts(),
    extras: {},
  };
}

function isBusinessService(serviceType) {
  return businessServiceTypes.includes(serviceType);
}

function isMoveOutService(serviceType) {
  return serviceType === 'mudanza';
}

function isPostConstructionService(serviceType) {
  return serviceType === 'postobra';
}

function shouldShowPets(serviceType) {
  return serviceType === 'casa' || serviceType === 'departamento';
}

function getVisibleCounters(serviceType) {
  if (isMoveOutService(serviceType)) {
    return moveOutCounters;
  }

  if (isPostConstructionService(serviceType)) {
    return postConstructionCounters;
  }

  return isBusinessService(serviceType) ? businessCounters : residentialCounters;
}

function getVisibleExtras(serviceType) {
  return extraOptions.filter((extra) => !extra.services || extra.services.includes(serviceType));
}

function getVisibleFrequencies(serviceType) {
  if (isMoveOutService(serviceType) || isPostConstructionService(serviceType)) {
    return frequencyOptions.filter((option) => option.value === 'puntual');
  }

  return frequencyOptions;
}

function getSelectedFrequency(answers) {
  const visibleFrequencies = getVisibleFrequencies(answers.serviceType);

  return visibleFrequencies.find((option) => option.value === answers.frequency) ?? visibleFrequencies[0];
}

function formatMoney(value) {
  return `${quoteConfig.currency}${value}`;
}

function roundTo(value, step = quoteConfig.rounding) {
  return Math.round(value / step) * step;
}

function clampNumber(value, min, max) {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return min;
  }

  return Math.min(max, Math.max(min, numericValue));
}

function getExtraMaxQuantity(extraId, answers) {
  const extra = getExtraOption(extraId);

  if (extra?.pricingMode === 'roomBased') {
    return 1;
  }

  if (singleQuantityExtras.has(extraId)) {
    return 1;
  }

  if (extraId === 'beds') {
    return Math.max(1, Number(answers.counts.bedrooms || 1));
  }

  if (extraId === 'furniture') {
    return 12;
  }

  if (extraId === 'interiorGlass' || extraId === 'exteriorGlass') {
    return 20;
  }

  return 10;
}

function getExtraUnitLabel(extraId) {
  const labels = {
    interiorGlass: 'secciones',
    exteriorGlass: 'secciones',
    glassDoors: 'unidades',
    largeMirrors: 'espejos',
    beds: 'camas',
    furniture: 'muebles',
    cabinetInterior: 'módulos',
    mattresses: 'colchones',
    smallCarpets: 'alfombras',
    ovenMicrowave: 'equipos',
    fridge: 'equipo',
    heavyGrease: 'servicio',
    highDust: 'servicio',
    lightTrash: 'servicio',
    odorDetail: 'servicio',
    delicateSurfaces: 'servicio',
    difficultAccess: 'servicio',
  };

  return labels[extraId] ?? 'unidades';
}

function getRoomBasedUnits(extra, context) {
  if (extra.roomSource === 'bedroomKitchen') {
    if (isPostConstructionService(context.answers.serviceType)) {
      return Math.max(1, Number(context.answers.counts.postWindows || 0));
    }

    if (isMoveOutService(context.answers.serviceType)) {
      return Math.max(
        1,
        Number(context.answers.counts.emptyBedrooms || 0) + Number(context.answers.counts.emptyKitchens || 0),
      );
    }

    if (isBusinessService(context.answers.serviceType)) {
      return Math.max(
        1,
        Number(context.answers.counts.meetingRooms || 0) +
          Number(context.answers.counts.receptions || 0) +
          Number(context.answers.counts.kitchenettes || 0),
      );
    }

    return Math.max(
      1,
      Number(context.answers.counts.bedrooms || 0) + Number(context.answers.counts.kitchens || 0),
    );
  }

  return 1;
}

function calculateExtraMetrics(extra, quantity, context) {
  if (extra.pricingMode === 'roomBased') {
    const billableUnits = getRoomBasedUnits(extra, context);

    return {
      quantity: billableUnits,
      price: roundTo(billableUnits * extra.roomRate, quoteConfig.rounding),
      minutes: extra.minutes * billableUnits,
      appliesMultipliers: extra.appliesMultipliers === true,
    };
  }

  const surface = extra.requiresDetail === 'delicateSurface'
    ? getDelicateSurfaceOption(context.answers.delicateSurface)
    : null;
  const surfaceMultiplier = surface?.multiplier ?? 1;

  return {
    quantity,
    price: roundTo(extra.price * quantity * surfaceMultiplier, 0.5),
    minutes: Math.round(extra.minutes * quantity * surfaceMultiplier),
    appliesMultipliers: extra.appliesMultipliers === true,
    detailLabel: surface
      ? surface.value === 'otros' && context.answers.delicateSurfaceOther
        ? `${surface.label}: ${context.answers.delicateSurfaceOther}`
        : surface.label
      : null,
  };
}

function getPetItems(answers) {
  if (!shouldShowPets(answers.serviceType)) {
    return [];
  }

  return petCounters
    .map((counter) => {
      const quantity = Number(answers.counts[counter.id] || 0);

      return {
        id: counter.id,
        label: counter.label,
        quantity,
        price: counter.price * quantity,
        minutes: counter.minutes * quantity,
      };
    })
    .filter((item) => item.quantity > 0);
}

function getPetSummary(petItems) {
  if (!petItems.length) {
    return 'Sin mascotas';
  }

  return petItems.map((item) => `${item.label}: ${item.quantity}`).join(', ');
}

function calculateQuote(answers) {
  const serviceType = getServiceType(answers.serviceType);
  const size = getSizeOption(answers.size);
  const condition = getConditionOption(answers.condition);
  const frequency = getSelectedFrequency(answers);
  const followUpCondition = getConditionOption(frequency.followUpCondition ?? condition.value);
  const visitCount = frequency.visitCount ?? 1;
  const followUpVisitCount = Math.max(0, visitCount - 1);
  const materials = getMaterialOption(answers.materials);
  const urgency = getUrgencyOption(answers.urgency);
  const city = getCityOption(answers.city);
  const counters = getVisibleCounters(answers.serviceType);
  const visibleExtraIds = new Set(getVisibleExtras(answers.serviceType).map((extra) => extra.id));

  const areaItems = counters
    .map((counter) => {
      const quantity = Number(answers.counts[counter.id] || 0);

      return {
        id: counter.id,
        label: counter.label,
        quantity,
        price: counter.price * quantity,
        minutes: counter.minutes * quantity,
      };
    })
    .filter((item) => item.quantity > 0);

  const areaTotal = areaItems.reduce((total, item) => total + item.price, 0);

  const extraItems = Object.entries(answers.extras)
    .map(([extraId, quantity]) => {
      const extra = getExtraOption(extraId);
      const numericQuantity = Number(quantity || 0);

      if (!extra || !visibleExtraIds.has(extraId) || numericQuantity <= 0) {
        return null;
      }

      const metrics = calculateExtraMetrics(extra, numericQuantity, {
        answers,
      });

      return {
        id: extraId,
        label: extra.label,
        summaryLabel: metrics.detailLabel ? `${extra.label} (${metrics.detailLabel})` : extra.label,
        quantity: metrics.quantity,
        price: metrics.price,
        minutes: metrics.minutes,
        appliesMultipliers: metrics.appliesMultipliers,
      };
    })
    .filter(Boolean);

  const petItems = getPetItems(answers);
  const petTotal = petItems.reduce((total, item) => total + item.price, 0);
  const petMinutes = petItems.reduce((total, item) => total + item.minutes, 0);
  const variableExtraTotal = extraItems
    .filter((item) => item.appliesMultipliers)
    .reduce((total, item) => total + item.price, 0);
  const fixedExtraTotal = extraItems
    .filter((item) => !item.appliesMultipliers)
    .reduce((total, item) => total + item.price, 0);
  const extraTotal = variableExtraTotal + fixedExtraTotal;
  const laborSubtotal = serviceType.basePrice + areaTotal + variableExtraTotal + petTotal;
  const operationalFixedCharges = materials.price + city.travelFee;
  const fixedCharges = fixedExtraTotal + operationalFixedCharges;
  const firstVisitMultiplier = serviceType.multiplier * size.multiplier * condition.multiplier;
  const followUpVisitMultiplier = serviceType.multiplier * size.multiplier * followUpCondition.multiplier;
  const packageMultiplier = frequency.multiplier ?? 1;
  const firstVisitPriceMultiplier = urgency.multiplier;
  const baseSubtotal = laborSubtotal + fixedCharges;

  const minutes = [...areaItems, ...extraItems].reduce((total, item) => total + item.minutes, petMinutes);
  const firstVisitMinutes = Math.max(90, Math.round(minutes * firstVisitMultiplier));
  const followUpVisitMinutes = Math.max(90, Math.round(minutes * followUpVisitMultiplier));
  const firstVisitLaborValue = laborSubtotal * firstVisitMultiplier * firstVisitPriceMultiplier;
  const followUpVisitLaborValue = laborSubtotal * followUpVisitMultiplier;
  const packageLaborTotal = firstVisitLaborValue + (followUpVisitLaborValue * followUpVisitCount);
  const serviceFixedTotal = operationalFixedCharges * visitCount;
  const extraFixedTotal = fixedExtraTotal * visitCount;
  const packageFixedTotal = serviceFixedTotal + extraFixedTotal;
  const packageDiscount = packageLaborTotal * (1 - packageMultiplier);
  const firstVisitValue = firstVisitLaborValue + fixedCharges;
  const followUpVisitValue = followUpVisitLaborValue + fixedCharges;
  const serviceTotalBeforeExtras = (packageLaborTotal * packageMultiplier) + serviceFixedTotal;
  const estimated = roundTo(
    Math.max(quoteConfig.minPrice * visitCount, serviceTotalBeforeExtras) + extraFixedTotal,
  );
  const low = estimated;
  const high = estimated;

  const firstVisitDisplayMinutes = firstVisitMinutes + quoteConfig.timeSafetyBufferMinutes;
  const followUpVisitDisplayMinutes = followUpVisitMinutes + quoteConfig.timeSafetyBufferMinutes;
  const longestVisitDisplayMinutes = Math.max(
    firstVisitDisplayMinutes,
    followUpVisitCount > 0 ? followUpVisitDisplayMinutes : firstVisitDisplayMinutes,
  );
  const longestVisitHours = Math.max(2, Math.ceil((longestVisitDisplayMinutes / 60) * 2) / 2);
  const peopleByDuration = Math.ceil(longestVisitHours / quoteConfig.maxHoursPerPerson);
  const suggestedPeople = Math.max(quoteConfig.defaultTeamSize, peopleByDuration);
  const firstVisitHours = Math.max(
    1.5,
    Math.ceil(((firstVisitDisplayMinutes / 60) / suggestedPeople) * 2) / 2,
  );
  const followUpVisitHours = Math.max(
    1.5,
    Math.ceil(((followUpVisitDisplayMinutes / 60) / suggestedPeople) * 2) / 2,
  );
  const visitHours = firstVisitHours;
  const totalDisplayMinutes = firstVisitDisplayMinutes + (followUpVisitDisplayMinutes * followUpVisitCount);
  const totalHours = Math.max(2, Math.ceil((totalDisplayMinutes / 60) * 2) / 2);

  return {
    estimated,
    low,
    high,
    serviceType,
    size,
    condition,
    frequency,
    materials,
    petItems,
    petSummary: getPetSummary(petItems),
    urgency,
    city,
    areaItems,
    extraItems,
    areaTotal,
    extraTotal,
    baseSubtotal,
    laborSubtotal,
    variableExtraTotal,
    fixedExtraTotal,
    fixedCharges,
    firstVisitMultiplier,
    followUpVisitMultiplier,
    packageMultiplier,
    packageLaborTotal,
    packageFixedTotal,
    packageDiscount,
    visitCount,
    followUpVisitCount,
    firstVisitValue,
    followUpVisitValue,
    firstVisitDisplayMinutes,
    followUpVisitDisplayMinutes,
    totalDisplayMinutes,
    suggestedPeople,
    totalHours,
    visitHours,
    firstVisitHours,
    followUpVisitHours,
    followUpCondition,
  };
}

function getFrequencySummary(quote) {
  if (quote.visitCount <= 1) {
    return '1 visita';
  }

  return `${quote.visitCount} visitas con descuento: primera ${quote.condition.label}, siguientes ${quote.followUpCondition.label}`;
}

function getTimeSummary(quote) {
  if (quote.visitCount <= 1) {
    return `${quote.suggestedPeople} persona(s), aprox. ${quote.firstVisitHours} h por visita`;
  }

  return `${quote.suggestedPeople} persona(s), primera aprox. ${quote.firstVisitHours} h; siguientes aprox. ${quote.followUpVisitHours} h`;
}

function buildWhatsappHref(answers, quote) {
  const areaSummary = quote.areaItems.length
    ? quote.areaItems.map((item) => `${item.label}: ${item.quantity}`).join('\n')
    : 'Sin ambientes seleccionados';

  const extraSummary = quote.extraItems.length
    ? quote.extraItems.map((item) => `${item.summaryLabel ?? item.label}: ${item.quantity}`).join('\n')
    : 'Sin extras';

  const message = [
    'Hola NIVO, quiero confirmar una cotización guiada de limpieza.',
    '',
    `Tipo de espacio: ${quote.serviceType.label}`,
    `Tamaño: ${quote.size.label}`,
    `Estado primera visita: ${quote.condition.label}`,
    quote.followUpVisitCount > 0 ? `Estado visitas siguientes: ${quote.followUpCondition.label}` : null,
    `Frecuencia: ${quote.frequency.label} (${getFrequencySummary(quote)})`,
    `Materiales: ${quote.materials.label}`,
    `Mascotas: ${quote.petSummary}`,
    `Urgencia: ${quote.urgency.label}`,
    '',
    'Ambientes:',
    areaSummary,
    '',
    'Extras:',
    extraSummary,
    '',
    `Ciudad: ${quote.city.label}`,
    `Sector / referencia: ${answers.sector || 'Por confirmar'}`,
    `Valor calculado: ${formatMoney(quote.estimated)}`,
    `Tiempo estimado: ${getTimeSummary(quote)}`,
    '',
    answers.notes ? `Observaciones: ${answers.notes}` : 'Observaciones: Por confirmar con fotos.',
    '',
    'Quisiera coordinar la visita con este valor calculado.',
  ].filter(Boolean).join('\n');

  return `${quoteConfig.whatsappBase}?text=${encodeURIComponent(message)}`;
}

function ChoiceCard({ checked, detail, label, name, onChange, value }) {
  return (
    <label className="quote-choice" data-active={checked ? 'true' : 'false'}>
      <input checked={checked} name={name} onChange={onChange} type="radio" value={value} />
      <span className="quote-choice__mark" aria-hidden="true" />
      <span>
        <strong>{label}</strong>
        {detail ? <small>{detail}</small> : null}
      </span>
    </label>
  );
}

function CounterCard({ counter, onChange, value }) {
  const currentValue = Number(value || 0);

  return (
    <article className="quote-counter">
      <div>
        <strong>{counter.label}</strong>
        <small>{counter.detail}</small>
      </div>

      <div className="quote-counter__control" aria-label={counter.label}>
        <button
          type="button"
          onClick={() => onChange(counter.id, currentValue - 1)}
          aria-label={`Restar ${counter.label}`}
        >
          −
        </button>
        <input
          inputMode="numeric"
          max={counter.max}
          min="0"
          onChange={(event) => onChange(counter.id, event.target.value)}
          type="number"
          value={currentValue}
        />
        <button
          type="button"
          onClick={() => onChange(counter.id, currentValue + 1)}
          aria-label={`Sumar ${counter.label}`}
        >
          +
        </button>
      </div>
    </article>
  );
}

function StepHeader({ activeStep }) {
  const current = quoteFlow[activeStep];

  return (
    <div className="quote-step-header">
      <span>{current.eyebrow}</span>
      <h1>{current.title}</h1>
      <p>{current.description}</p>
    </div>
  );
}

export default function QuoteWizard() {
  const [answers, setAnswers] = useState(getInitialAnswers);
  const [activeStep, setActiveStep] = useState(0);
  const [summaryReady, setSummaryReady] = useState(false);

  const visibleCounters = useMemo(() => getVisibleCounters(answers.serviceType), [answers.serviceType]);
  const quote = useMemo(() => calculateQuote(answers), [answers]);
  const whatsappHref = useMemo(() => buildWhatsappHref(answers, quote), [answers, quote]);
  const progress = summaryReady ? 100 : ((activeStep + 1) / quoteFlow.length) * 100;

  function updateField(field, value) {
    setAnswers((current) => ({
      ...current,
      [field]: value,
      ...(field === 'serviceType' && !getVisibleFrequencies(value).some((option) => option.value === current.frequency)
        ? { frequency: frequencyOptions[0].value }
        : {}),
    }));
  }

  function updateCount(counterId, value) {
    const counter = [
      ...residentialCounters,
      ...moveOutCounters,
      ...postConstructionCounters,
      ...businessCounters,
      ...petCounters,
    ].find((item) => item.id === counterId);
    const nextValue = clampNumber(value, 0, counter?.max ?? 99);

    setAnswers((current) => ({
      ...current,
      counts: {
        ...current.counts,
        [counterId]: nextValue,
      },
    }));
  }

  function toggleExtra(extraId) {
    setAnswers((current) => {
      const exists = Object.prototype.hasOwnProperty.call(current.extras, extraId);
      const nextExtras = { ...current.extras };

      if (exists) {
        delete nextExtras[extraId];
      } else {
        nextExtras[extraId] = 1;
      }

      return {
        ...current,
        extras: nextExtras,
      };
    });
  }

  function updateExtraQuantity(extraId, value) {
    const maxQuantity = getExtraMaxQuantity(extraId, answers);
    const nextValue = clampNumber(value, 1, maxQuantity);

    setAnswers((current) => ({
      ...current,
      extras: {
        ...current.extras,
        [extraId]: nextValue,
      },
    }));
  }

  function goNext() {
    setActiveStep((current) => Math.min(current + 1, quoteFlow.length - 1));
  }

  function goBack() {
    setSummaryReady(false);
    setActiveStep((current) => Math.max(current - 1, 0));
  }

  function finishQuote() {
    setSummaryReady(true);
  }

  function editQuote() {
    setSummaryReady(false);
  }

  function renderChoiceGrid(name, options, columns = 'auto') {
    return (
      <div className="quote-choice-grid" data-columns={columns}>
        {options.map((option) => (
          <ChoiceCard
            checked={answers[name] === option.value}
            detail={option.detail}
            key={option.value}
            label={option.label}
            name={name}
            onChange={() => updateField(name, option.value)}
            value={option.value}
          />
        ))}
      </div>
    );
  }

  function renderStep() {
    if (activeStep === 0) {
      return renderChoiceGrid('serviceType', serviceTypes);
    }

    if (activeStep === 1) {
      return (
        <div className="quote-counter-grid">
          {visibleCounters.map((counter) => (
            <CounterCard
              counter={counter}
              key={counter.id}
              onChange={updateCount}
              value={answers.counts[counter.id]}
            />
          ))}
        </div>
      );
    }

    if (activeStep === 2) {
      return (
        <div className="quote-stacked-groups">
          <section>
            <h2>Tamaño aproximado</h2>
            {renderChoiceGrid('size', sizeOptions, 'four')}
          </section>

          <section>
            <h2>Estado actual</h2>
            {renderChoiceGrid('condition', conditionOptions, 'four')}
          </section>

          <section>
            <h2>Frecuencia</h2>
            {renderChoiceGrid('frequency', getVisibleFrequencies(answers.serviceType), 'three')}
          </section>
        </div>
      );
    }

    if (activeStep === 3) {
      const showPets = shouldShowPets(answers.serviceType);

      return (
        <div className="quote-stacked-groups">
          <section>
            <h2>Materiales</h2>
            {renderChoiceGrid('materials', materialOptions, 'three')}
          </section>

          {showPets ? (
            <section>
              <h2>Mascotas</h2>
              <div className="quote-counter-grid">
                {petCounters.map((counter) => (
                  <CounterCard
                    counter={counter}
                    key={counter.id}
                    onChange={updateCount}
                    value={answers.counts[counter.id]}
                  />
                ))}
              </div>
            </section>
          ) : null}

          <section>
            <h2>Urgencia</h2>
            {renderChoiceGrid('urgency', urgencyOptions, 'three')}
          </section>
        </div>
      );
    }

    if (activeStep === 4) {
      const visibleExtras = getVisibleExtras(answers.serviceType);

      return (
        <div className="quote-extra-grid">
          {visibleExtras.map((extra) => {
            const selected = Object.prototype.hasOwnProperty.call(answers.extras, extra.id);
            const quantity = answers.extras[extra.id] ?? 1;
            const maxQuantity = getExtraMaxQuantity(extra.id, answers);

            return (
              <article className="quote-extra" data-active={selected ? 'true' : 'false'} key={extra.id}>
                <label>
                  <input checked={selected} onChange={() => toggleExtra(extra.id)} type="checkbox" />
                  <span>
                    <strong>{extra.label}</strong>
                    {extra.detail ? <small>{extra.detail}</small> : null}
                  </span>
                </label>

                {selected && maxQuantity > 1 ? (
                  <div className="quote-extra__quantity">
                    <span>{getExtraUnitLabel(extra.id)}</span>
                    <div className="quote-counter__control">
                      <button
                        type="button"
                        onClick={() => updateExtraQuantity(extra.id, Number(quantity) - 1)}
                        aria-label={`Restar ${extra.label}`}
                      >
                        −
                      </button>
                      <input
                        inputMode="numeric"
                        max={maxQuantity}
                        min="1"
                        onChange={(event) => updateExtraQuantity(extra.id, event.target.value)}
                        type="number"
                        value={quantity}
                      />
                      <button
                        type="button"
                        onClick={() => updateExtraQuantity(extra.id, Number(quantity) + 1)}
                        aria-label={`Sumar ${extra.label}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ) : null}

                {selected && extra.requiresDetail === 'delicateSurface' ? (
                  <div className="quote-extra__detail">
                    <label className="quote-field quote-field--compact">
                      <span>Tipo de superficie</span>
                      <select
                        onChange={(event) => updateField('delicateSurface', event.target.value)}
                        value={answers.delicateSurface}
                      >
                        {delicateSurfaceOptions.map((surface) => (
                          <option key={surface.value} value={surface.value}>
                            {surface.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    {answers.delicateSurface === 'otros' ? (
                      <label className="quote-field quote-field--compact">
                        <span>Indica el material</span>
                        <input
                          onChange={(event) => updateField('delicateSurfaceOther', event.target.value)}
                          placeholder="Ej. porcelanato, granito, cuero, pieza decorativa..."
                          type="text"
                          value={answers.delicateSurfaceOther}
                        />
                      </label>
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      );
    }

    if (activeStep === 5) {
      return (
        <div className="quote-location-grid">
          <section>
            <h2>Ciudad</h2>
            {renderChoiceGrid('city', cityOptions)}
          </section>

          <label className="quote-field">
            <span>Sector o referencia</span>
            <input
              onChange={(event) => updateField('sector', event.target.value)}
              placeholder="Ej. Centro de Ibarra, Los Ceibos, cerca del parque..."
              type="text"
              value={answers.sector}
            />
          </label>

          <label className="quote-field quote-field--wide">
            <span>Observaciones opcionales</span>
            <textarea
              onChange={(event) => updateField('notes', event.target.value)}
              placeholder="Ej. Hay área de máquinas, grasa en cocina, gatos, vidrios altos, polvo acumulado, acceso difícil, muebles delicados..."
              value={answers.notes}
            />
          </label>
        </div>
      );
    }

    return (
      <div className="quote-final">
        <div className="quote-final__price">
          <span>Valor calculado</span>
          <strong>{formatMoney(quote.estimated)}</strong>
          <p>
            {quote.visitCount <= 1
              ? `La visita se estima con ${getTimeSummary(quote)}.`
              : `El paquete incluye ${getFrequencySummary(quote).toLowerCase()} y se estima con ${getTimeSummary(quote)}.`}
          </p>
        </div>

        <div className="quote-final__grid">
          <article>
            <span>Servicio</span>
            <strong>{quote.serviceType.label}</strong>
          </article>
          <article>
            <span>Estado inicial</span>
            <strong>{quote.condition.label}</strong>
          </article>
          <article>
            <span>Frecuencia</span>
            <strong>{getFrequencySummary(quote)}</strong>
          </article>
          <article>
            <span>Ciudad</span>
            <strong>{quote.city.label}</strong>
          </article>
        </div>

        <div className="quote-breakdown">
          <h2>Resumen usado para calcular</h2>
          <ul>
            {quote.areaItems.map((item) => (
              <li key={item.id}>{item.label}: {item.quantity}</li>
            ))}
            {quote.extraItems.map((item) => (
              <li key={item.id}>{item.summaryLabel ?? item.label}: {item.quantity}</li>
            ))}
          </ul>
        </div>

      </div>
    );
  }

  if (summaryReady) {
    return (
      <div className="quote-page-wizard quote-page-wizard--summary">
        <div className="quote-progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>

        <article className="quote-summary-card">
          <div className="quote-summary-card__header">
            <span>Cotización lista</span>
            <h1>Resumen de tu limpieza</h1>
            <strong>{formatMoney(quote.estimated)}</strong>
            <p>{getFrequencySummary(quote)} · {getTimeSummary(quote)}</p>
          </div>

          <div className="quote-final__grid">
            <article>
              <span>Servicio</span>
              <strong>{quote.serviceType.label}</strong>
            </article>
            <article>
              <span>Estado inicial</span>
              <strong>{quote.condition.label}</strong>
            </article>
            <article>
              <span>Ciudad</span>
              <strong>{quote.city.label}</strong>
            </article>
            <article>
              <span>Equipo sugerido</span>
              <strong>{quote.suggestedPeople} persona(s)</strong>
            </article>
          </div>

          <div className="quote-breakdown">
            <h2>Incluido en el cálculo</h2>
            <ul>
              {quote.areaItems.map((item) => (
                <li key={item.id}>{item.label}: {item.quantity}</li>
              ))}
              {quote.extraItems.map((item) => (
                <li key={item.id}>{item.summaryLabel ?? item.label}: {item.quantity}</li>
              ))}
            </ul>
          </div>

          <div className="quote-summary-actions">
            <button className="quote-nav-button quote-nav-button--ghost" onClick={editQuote} type="button">
              Editar datos
            </button>
            <a className="quote-result__button" href={whatsappHref} target="_blank" rel="noreferrer">
              Confirmar por WhatsApp
            </a>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="quote-page-wizard">
      <div className="quote-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="quote-wizard-panel">
        <div className="quote-main-panel">
          <StepHeader activeStep={activeStep} />
          {renderStep()}

          <div className="quote-navigation">
            <button className="quote-nav-button quote-nav-button--ghost" disabled={activeStep === 0} onClick={goBack} type="button">
              Anterior
            </button>

            {activeStep < quoteFlow.length - 1 ? (
              <button className="quote-nav-button" onClick={goNext} type="button">
                Continuar
              </button>
            ) : (
              <button className="quote-nav-button" onClick={finishQuote} type="button">
                Finalizar
              </button>
            )}
          </div>
        </div>

        <aside className="quote-live-summary" aria-live="polite">
          <span className="quote-live-summary__label">Valor en vivo</span>
          <strong>{formatMoney(quote.estimated)}</strong>
          <p>{getFrequencySummary(quote)}</p>
          <p className="quote-live-summary__time">{getTimeSummary(quote)}</p>
        </aside>
      </div>
    </div>
  );
}
