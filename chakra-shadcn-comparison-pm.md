# Chakra UI и Shadcn UI

## Основные различия

| Критерий | Chakra UI | Shadcn UI |
|----------|-----------|-----------|
| **Тип решения** | Готовая библиотека компонентов | Набор компонентов для копирования в проект |
| **Стиль разработки** | Стили через атрибуты (пропсы) | Стили через CSS-классы (Tailwind) |
| **Контроль над кодом** | Компоненты в node_modules | Компоненты непосредственно в проекте |
| **Опыт разработки** | Меньше кода, больше готовых решений | Больше контроля, но больше ручной работы |
| **Подходит для** | Бизнес-приложения, админ-панели | Кастомные интерфейсы |

## Разные подходы к дизайн-токенам

Дизайн-токены — это набор стандартных значений для цветов, размеров и отступов, которые обеспечивают единый вид интерфейса. По сути, это словарь дизайна приложения.

### Как работают токены в разных библиотеках:

**Chakra UI:**
- Токены встроены в саму библиотеку
- Легко использовать через названия: `цвет="синий.500"` вместо конкретных кодов цветов
- Изменения токенов сразу применяются ко всем компонентам
- Темная/светлая тема работает "из коробки"

**Shadcn UI:**
- Токены хранятся в конфигурации проекта
- Используются через классы
- Для поддержки тем требуется дополнительная настройка

### Влияние на проект:

| Аспект | Chakra UI | Shadcn UI |
|--------|-----------|-----------|
| **Удобство использования** | Проще для быстрой разработки | Требует больше ручной настройки |
| **Скорость работы** | Медленнее | Быстрее |
| **Уникальность дизайна** | Средняя (похож на другие Chakra-проекты) | Высокая (полный контроль) |

## Наглядные примеры дизайн-токенов

Дизайн-токены определяют различные аспекты внешнего вида интерфейса. Вот основные типы токенов с примерами:

### 1. Цветовые токены

Цветовые токены определяют все цвета в приложении. Вместо использования конкретных HEX-кодов (#FF5733) везде используются названия токенов.

| Токен | Значение | Применение |
|-------|----------|------------|
| **primary** | #4299E1 | Основные кнопки, ссылки, выделение активных элементов |
| **secondary** | #718096 | Второстепенные кнопки, альтернативные действия |
| **background** | #F7FAFC | Фон страницы или карточек |
| **text** | #1A202C | Основной текст |


### 2. Размерные токены

Определяют все размеры в интерфейсе, создавая гармоничную систему пропорций.

| Токен | Значение | Применение |
|-------|----------|------------|
| **xs** | 0.25rem (4px) | Минимальные отступы, границы |
| **sm** | 0.5rem (8px) | Малые отступы, промежутки между близкими элементами |

Это делает интерфейс CRM более организованным — одинаковые отступы между карточками клиентов, формами и таблицами данных.

### 3. Типографические токены

Определяют все параметры текста в приложении.

| Токен | Значение | Применение |
|-------|----------|------------|
| **fontSize.xs** | 0.75rem (12px) | Мелкий текст, примечания |
| **fontSize.sm** | 0.875rem (14px) | Второстепенный текст |
| **fontSize.md** | 1rem (16px) | Основной текст |

Обеспечивает четкую иерархию информации — данные клиента, заголовки таблиц, пояснения имеют согласованный внешний вид.

### 4. Токены скругления

Определяют закругление углов элементов.

| Токен | Значение | Применение |
|-------|----------|------------|
| **borderRadius.none** | 0 | Без скругления |
| **borderRadius.sm** | 0.125rem (2px) | Минимальное скругление |

В применяется к карточкам, кнопкам, полям ввода, придавая интерфейсу единый стиль.


### 5. Токены пространства (спейсинг)

Эти токены определяют отступы и пространство между элементами, создавая ритм и гармонию интерфейса.

| Токен | Значение | Применение |
|-------|----------|------------|
| **space.0** | 0 | Отсутствие отступа |
| **space.1** | 0.25rem (4px) | Минимальный отступ между близкими элементами |
| **space.12** | 3rem (48px) | Максимальный отступ |

### 7. Токены адаптивного дизайна (брейкпоинты)

Определяют, как интерфейс меняется при разных размерах экрана.

| Токен | Значение | Применение |
|-------|----------|------------|
| **breakpoints.sm** | 30em (480px) | Мобильные устройства |
| **breakpoints.md** | 48em (768px) | Планшеты |


### 8. Токены анимаций

Определяют, как элементы интерфейса анимируются при взаимодействии.

| Токен | Значение | Применение |
|-------|----------|------------|
| **transition.duration.fast** | 100ms | Быстрые действия (клик кнопки) |
| **transition.easing.easeInOut** | cubic-bezier(0.4, 0, 0.2, 1) | Плавный переход |

Пример в CRM:
```
// Анимация появления карточки клиента
transition: 
  opacity transition.duration.normal transition.easing.easeOut,
  transform transition.duration.normal transition.easing.easeOut
```

### 9. Токены z-индекса (наложение слоев)

Определяют, какие элементы интерфейса располагаются выше других.

| Токен | Значение | Применение |
|-------|----------|------------|
| **zIndices.hide** | -1 | Скрытые элементы |
| **zIndices.base** | 0 | Базовый уровень |
| **zIndices.toast** | 1700 | Временные уведомления |
| **zIndices.tooltip** | 1800 | Подсказки |

В CRM это определяет порядок отображения интерфейса: основной контент, всплывающие фильтры, детальные карточки клиентов и уведомления.


## Преимущества Chakra UI для веб-CRM

1. **Быстрая разработка** — больше готовых компонентов для панелей, форм и фильтров ускоряют вывод продукта
2. **Единообразие интерфейса** — встроенная система дизайн-токенов обеспечивает согласованность
3. **Меньше кода** — меньше написания CSS, меньше тестирования базовых компонентов
4. **Проще поддержка** — обновления через пакетный менеджер, не требуется ручное обновление кода


## Преимущества Shadcn UI

1. **Полный контроль** — компоненты находятся в исходном коде проекта
2. **Меньше размер** — в финальную сборку попадают только используемые компоненты
3. **Лучшая производительность** — статический CSS вместо динамического CSS-in-JS
4. **Легко кастомизируемый визуальный стиль** — простота реализации уикальных визуальных решений

## Факторы выбора для CRM-проектов

### Chakra UI подходит если:

- Необходимо быстро выпустить продукт на рынок
- Команда разработки небольшая
- Нужны готовые компоненты для работы с данными
- Важна консистентность интерфейса
- Требуется долгосрочная поддержка

### Shadcn UI подходит если:

- Важен полный контроль над кодом
- Дизайн должен быть уникальным
- Критична производительность фронтенда
- Строгие требования к визуальной составляющей

## Влияние на проект

| Аспект | Chakra UI | Shadcn UI |
|--------|-----------|-----------|
| **Скорость разработки** | Выше | Ниже |
| **Гибкость дизайна** | Средняя | Высокая |
| **Сложность обновления** | Низкая | Высокая |
| **Кривая обучения** | Средняя | Высокая |
| **Контроль качества** | Проще | Сложнее |

## Заключение

Для переноса десктоп-CRM в веб-версию [] предоставляет оптимальный баланс между скоростью разработки и качеством интерфейса. Готовые компоненты для работы с данными, простота обновлений и встроенная система стилизации делают его предпочтительным выбором для бизнес-приложений. 

## Сравнение компонентов для CRM-систем

Для наглядности различий в подходах, рассмотрим, как реализуются типичные компоненты CRM-системы в обеих библиотеках.

### 1. Таблица клиентов

**Chakra UI:**
```jsx
// Таблица клиентов в Chakra UI
<Box overflowX="auto">
  <Table variant="simple">
    <Thead>
      <Tr>
        <Th>Имя клиента</Th>
        <Th>Статус</Th>
        <Th isNumeric>Сумма сделок</Th>
        <Th>Последний контакт</Th>
        <Th>Действия</Th>
      </Tr>
    </Thead>
    <Tbody>
      {clients.map((client) => (
        <Tr key={client.id}>
          <Td>{client.name}</Td>
          <Td>
            <Badge colorScheme={getStatusColor(client.status)}>
              {client.status}
            </Badge>
          </Td>
          <Td isNumeric>{formatCurrency(client.totalAmount)}</Td>
          <Td>{formatDate(client.lastContact)}</Td>
          <Td>
            <ButtonGroup size="sm" variant="ghost">
              <IconButton aria-label="Edit" icon={<EditIcon />} />
              <IconButton aria-label="Delete" icon={<DeleteIcon />} />
            </ButtonGroup>
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
</Box>
```

**Shadcn UI:**
```jsx
// Таблица клиентов в Shadcn UI
<div className="rounded-md border">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Имя клиента</TableHead>
        <TableHead>Статус</TableHead>
        <TableHead className="text-right">Сумма сделок</TableHead>
        <TableHead>Последний контакт</TableHead>
        <TableHead>Действия</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {clients.map((client) => (
        <TableRow key={client.id}>
          <TableCell>{client.name}</TableCell>
          <TableCell>
            <Badge variant={getStatusVariant(client.status)}>
              {client.status}
            </Badge>
          </TableCell>
          <TableCell className="text-right">{formatCurrency(client.totalAmount)}</TableCell>
          <TableCell>{formatDate(client.lastContact)}</TableCell>
          <TableCell>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <EditIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
```

### 2. Форма создания сделки

**Chakra UI:**
```jsx
// Форма создания сделки в Chakra UI
<Box as="form" onSubmit={handleSubmit} p={6} borderWidth="1px" borderRadius="lg">
  <VStack spacing={4} align="stretch">
    <FormControl isRequired>
      <FormLabel>Название сделки</FormLabel>
      <Input name="title" value={formData.title} onChange={handleChange} />
    </FormControl>
    
    <FormControl isRequired>
      <FormLabel>Клиент</FormLabel>
      <Select name="clientId" value={formData.clientId} onChange={handleChange}>
        <option value="">Выберите клиента</option>
        {clients.map(client => (
          <option key={client.id} value={client.id}>{client.name}</option>
        ))}
      </Select>
    </FormControl>
    
    <HStack>
      <FormControl isRequired>
        <FormLabel>Сумма</FormLabel>
        <InputGroup>
          <InputLeftAddon>₽</InputLeftAddon>
          <Input
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
          />
        </InputGroup>
      </FormControl>
      
      <FormControl>
        <FormLabel>Дата завершения</FormLabel>
        <Input
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </FormControl>
    </HStack>
    
    <FormControl>
      <FormLabel>Статус</FormLabel>
      <RadioGroup name="status" value={formData.status} onChange={handleStatusChange}>
        <HStack spacing={4}>
          <Radio value="new">Новая</Radio>
          <Radio value="negotiation">В работе</Radio>
          <Radio value="won">Завершена</Radio>
        </HStack>
      </RadioGroup>
    </FormControl>
    
    <FormControl>
      <FormLabel>Комментарий</FormLabel>
      <Textarea
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Дополнительная информация о сделке"
      />
    </FormControl>
    
    <ButtonGroup spacing={4} mt={4}>
      <Button type="submit" colorScheme="blue">Создать сделку</Button>
      <Button variant="outline" onClick={onCancel}>Отмена</Button>
    </ButtonGroup>
  </VStack>
</Box>
```

**Shadcn UI:**
```jsx
// Форма создания сделки в Shadcn UI
<Card>
  <CardHeader>
    <CardTitle>Новая сделка</CardTitle>
  </CardHeader>
  <CardContent>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Название сделки</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="clientId">Клиент</Label>
        <Select
          value={formData.clientId}
          onValueChange={(value) => setFormData({...formData, clientId: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите клиента" />
          </SelectTrigger>
          <SelectContent>
            {clients.map(client => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Сумма</Label>
          <div className="flex">
            <div className="flex items-center justify-center border border-r-0 rounded-l-md px-3 bg-muted">
              ₽
            </div>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              className="rounded-l-none"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dueDate">Дата завершения</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Статус</Label>
        <RadioGroup
          value={formData.status}
          onValueChange={(value) => setFormData({...formData, status: value})}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="new" id="new" />
            <Label htmlFor="new">Новая</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="negotiation" id="negotiation" />
            <Label htmlFor="negotiation">В работе</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="won" id="won" />
            <Label htmlFor="won">Завершена</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Комментарий</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Дополнительная информация о сделке"
        />
      </div>
      
      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" type="button" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit">Создать сделку</Button>
      </div>
    </form>
  </CardContent>
</Card>
```

### 3. Дашборд с информацией по продажам

**Chakra UI:**
```jsx
// Дашборд в Chakra UI
<Box p={4}>
  <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
    <Stat
      px={4}
      py={3}
      bg="white"
      borderRadius="lg"
      boxShadow="sm"
    >
      <StatLabel color="gray.500">Общая выручка</StatLabel>
      <StatNumber fontSize="2xl">{formatCurrency(totalRevenue)}</StatNumber>
      <StatHelpText>
        <StatArrow type={revenueGrowth > 0 ? "increase" : "decrease"} />
        {Math.abs(revenueGrowth)}% с прошлого месяца
      </StatHelpText>
    </Stat>
    
    <Stat
      px={4}
      py={3}
      bg="white"
      borderRadius="lg"
      boxShadow="sm"
    >
      <StatLabel color="gray.500">Новых сделок</StatLabel>
      <StatNumber fontSize="2xl">{newDeals}</StatNumber>
      <StatHelpText>За последний месяц</StatHelpText>
    </Stat>
    
    <Stat
      px={4}
      py={3}
      bg="white"
      borderRadius="lg"
      boxShadow="sm"
    >
      <StatLabel color="gray.500">Закрытых сделок</StatLabel>
      <StatNumber fontSize="2xl">{closedDeals}</StatNumber>
      <StatHelpText>
        Конверсия {conversionRate}%
      </StatHelpText>
    </Stat>
    
    <Stat
      px={4}
      py={3}
      bg="white"
      borderRadius="lg"
      boxShadow="sm"
    >
      <StatLabel color="gray.500">Средний чек</StatLabel>
      <StatNumber fontSize="2xl">{formatCurrency(averageCheck)}</StatNumber>
      <StatHelpText>
        <StatArrow type={avgCheckGrowth > 0 ? "increase" : "decrease"} />
        {Math.abs(avgCheckGrowth)}% с прошлого месяца
      </StatHelpText>
    </Stat>
  </SimpleGrid>
  
  <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
    <GridItem>
      <Box bg="white" p={4} borderRadius="lg" boxShadow="sm" height="100%">
        <Heading size="md" mb={4}>Динамика продаж</Heading>
        {/* Здесь компонент графика */}
      </Box>
    </GridItem>
    
    <GridItem>
      <Box bg="white" p={4} borderRadius="lg" boxShadow="sm" height="100%">
        <Heading size="md" mb={4}>Топ клиентов</Heading>
        <List spacing={3}>
          {topClients.map(client => (
            <ListItem key={client.id} p={2} borderRadius="md" _hover={{ bg: "gray.50" }}>
              <Flex justify="space-between" align="center">
                <Box>
                  <Text fontWeight="medium">{client.name}</Text>
                  <Text fontSize="sm" color="gray.500">{client.deals} сделок</Text>
                </Box>
                <Text fontWeight="bold">{formatCurrency(client.revenue)}</Text>
              </Flex>
            </ListItem>
          ))}
        </List>
      </Box>
    </GridItem>
  </Grid>
</Box>
```

**Shadcn UI:**
```jsx
// Дашборд в Shadcn UI
<div className="p-4 space-y-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <Card>
      <CardContent className="pt-6">
        <div className="text-sm font-medium text-muted-foreground">
          Общая выручка
        </div>
        <div className="text-2xl font-bold mt-2">
          {formatCurrency(totalRevenue)}
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <div className={revenueGrowth > 0 ? "text-green-500" : "text-red-500"}>
            {revenueGrowth > 0 ? "↑" : "↓"} {Math.abs(revenueGrowth)}%
          </div>
          <div className="ml-1">с прошлого месяца</div>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="pt-6">
        <div className="text-sm font-medium text-muted-foreground">
          Новых сделок
        </div>
        <div className="text-2xl font-bold mt-2">
          {newDeals}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          За последний месяц
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="pt-6">
        <div className="text-sm font-medium text-muted-foreground">
          Закрытых сделок
        </div>
        <div className="text-2xl font-bold mt-2">
          {closedDeals}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Конверсия {conversionRate}%
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="pt-6">
        <div className="text-sm font-medium text-muted-foreground">
          Средний чек
        </div>
        <div className="text-2xl font-bold mt-2">
          {formatCurrency(averageCheck)}
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <div className={avgCheckGrowth > 0 ? "text-green-500" : "text-red-500"}>
            {avgCheckGrowth > 0 ? "↑" : "↓"} {Math.abs(avgCheckGrowth)}%
          </div>
          <div className="ml-1">с прошлого месяца</div>
        </div>
      </CardContent>
    </Card>
  </div>
  
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Динамика продаж</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Здесь компонент графика */}
        </CardContent>
      </Card>
    </div>
    
    <div>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Топ клиентов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topClients.map(client => (
              <div
                key={client.id}
                className="p-2 rounded-md hover:bg-muted flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{client.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {client.deals} сделок
                  </div>
                </div>
                <div className="font-bold">
                  {formatCurrency(client.revenue)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</div>
```

### 4. Календарь встреч

**Chakra UI:**
```jsx
// Календарь встреч в Chakra UI
<Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
  <Flex justify="space-between" align="center" mb={4}>
    <Heading size="md">Календарь встреч</Heading>
    <ButtonGroup size="sm" isAttached>
      <Button onClick={previousMonth} leftIcon={<ChevronLeftIcon />}>Пред</Button>
      <Button onClick={nextMonth} rightIcon={<ChevronRightIcon />}>След</Button>
    </ButtonGroup>
  </Flex>
  
  <Text fontWeight="medium" mb={4}>
    {format(currentMonth, 'MMMM yyyy')}
  </Text>
  
  <SimpleGrid columns={7} spacing={1} mb={2}>
    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
      <Center key={day} p={2} fontWeight="medium">
        {day}
      </Center>
    ))}
  </SimpleGrid>
  
  <SimpleGrid columns={7} spacing={1}>
    {calendarDays.map((day, i) => (
      <Box
        key={i}
        p={2}
        bg={isToday(day) ? "blue.50" : "transparent"}
        borderRadius="md"
        borderWidth={isSelected(day) ? "2px" : "1px"}
        borderColor={isSelected(day) ? "blue.500" : "gray.200"}
        onClick={() => selectDay(day)}
        cursor="pointer"
        _hover={{ bg: "gray.50" }}
      >
        <Text
          textAlign="center"
          color={isCurrentMonth(day) ? "inherit" : "gray.400"}
          fontWeight={isToday(day) ? "bold" : "normal"}
        >
          {format(day, 'd')}
        </Text>
        
        {getDayMeetings(day).length > 0 && (
          <VStack spacing={1} mt={1} align="stretch">
            {getDayMeetings(day).slice(0, 2).map(meeting => (
              <Box
                key={meeting.id}
                p={1}
                bg={meeting.type === 'client' ? "green.100" : "purple.100"}
                borderRadius="sm"
                fontSize="xs"
                noOfLines={1}
              >
                {format(parseISO(meeting.time), 'HH:mm')} {meeting.title}
              </Box>
            ))}
            {getDayMeetings(day).length > 2 && (
              <Center fontSize="xs" fontWeight="medium">
                +{getDayMeetings(day).length - 2} еще
              </Center>
            )}
          </VStack>
        )}
      </Box>
    ))}
  </SimpleGrid>
  
  {selectedDay && (
    <Box mt={6}>
      <Flex justify="space-between" align="center" mb={3}>
        <Heading size="sm">
          Встречи на {format(selectedDay, 'd MMMM')}
        </Heading>
        <Button
          size="sm"
          colorScheme="blue"
          leftIcon={<AddIcon />}
          onClick={openAddMeetingModal}
        >
          Новая встреча
        </Button>
      </Flex>
      
      {getDayMeetings(selectedDay).length === 0 ? (
        <Text color="gray.500">На этот день нет запланированных встреч</Text>
      ) : (
        <VStack spacing={2} align="stretch">
          {getDayMeetings(selectedDay).map(meeting => (
            <Flex
              key={meeting.id}
              p={3}
              borderWidth="1px"
              borderRadius="md"
              justify="space-between"
              align="center"
            >
              <Box>
                <Text fontWeight="medium">{meeting.title}</Text>
                <Flex fontSize="sm" color="gray.600" align="center">
                  <TimeIcon mr={1} />
                  {format(parseISO(meeting.time), 'HH:mm')}
                  {meeting.duration && ` (${meeting.duration} мин)`}
                </Flex>
              </Box>
              <Badge colorScheme={meeting.type === 'client' ? "green" : "purple"}>
                {meeting.type === 'client' ? 'Клиент' : 'Внутренняя'}
              </Badge>
            </Flex>
          ))}
        </VStack>
      )}
    </Box>
  )}
</Box>
```

**Shadcn UI:**
```jsx
// Календарь встреч в Shadcn UI
<Card>
  <CardContent className="pt-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-medium">Календарь встреч</h3>
      <div className="flex">
        <Button variant="outline" size="sm" onClick={previousMonth}>
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="sr-only">Предыдущий месяц</span>
        </Button>
        <Button variant="outline" size="sm" onClick={nextMonth}>
          <ChevronRightIcon className="h-4 w-4" />
          <span className="sr-only">Следующий месяц</span>
        </Button>
      </div>
    </div>
    
    <div className="font-medium mb-4">
      {format(currentMonth, 'MMMM yyyy')}
    </div>
    
    <div className="grid grid-cols-7 gap-1 mb-2">
      {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
        <div key={day} className="text-center font-medium p-2">
          {day}
        </div>
      ))}
    </div>
    
    <div className="grid grid-cols-7 gap-1">
      {calendarDays.map((day, i) => (
        <div
          key={i}
          className={cn(
            "p-2 border rounded-md cursor-pointer hover:bg-muted",
            isToday(day) ? "bg-blue-50" : "",
            isSelected(day) ? "border-primary border-2" : "border-border",
            "flex flex-col"
          )}
          onClick={() => selectDay(day)}
        >
          <div
            className={cn(
              "text-center",
              isCurrentMonth(day) ? "" : "text-muted-foreground",
              isToday(day) ? "font-bold" : ""
            )}
          >
            {format(day, 'd')}
          </div>
          
          {getDayMeetings(day).length > 0 && (
            <div className="mt-1 space-y-1">
              {getDayMeetings(day).slice(0, 2).map(meeting => (
                <div
                  key={meeting.id}
                  className={cn(
                    "p-1 rounded-sm text-xs truncate",
                    meeting.type === 'client' ? "bg-green-100" : "bg-purple-100"
                  )}
                >
                  {format(parseISO(meeting.time), 'HH:mm')} {meeting.title}
                </div>
              ))}
              {getDayMeetings(day).length > 2 && (
                <div className="text-xs font-medium text-center">
                  +{getDayMeetings(day).length - 2} еще
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
    
    {selectedDay && (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold">
            Встречи на {format(selectedDay, 'd MMMM')}
          </h4>
          <Button size="sm" onClick={openAddMeetingModal}>
            <PlusIcon className="h-4 w-4 mr-1" />
            Новая встреча
          </Button>
        </div>
        
        {getDayMeetings(selectedDay).length === 0 ? (
          <div className="text-muted-foreground">
            На этот день нет запланированных встреч
          </div>
        ) : (
          <div className="space-y-2">
            {getDayMeetings(selectedDay).map(meeting => (
              <div
                key={meeting.id}
                className="p-3 border rounded-md flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{meeting.title}</div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    {format(parseISO(meeting.time), 'HH:mm')}
                    {meeting.duration && ` (${meeting.duration} мин)`}
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={cn(
                    meeting.type === 'client' 
                      ? "bg-green-100 text-green-800 hover:bg-green-100" 
                      : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                  )}
                >
                  {meeting.type === 'client' ? 'Клиент' : 'Внутренняя'}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </CardContent>
</Card>
```

### Ключевые отличия в коде компонентов:

#### 1. Способ задания стилей
- **Chakra UI**: Использует проп-ориентированный подход (`p={4}`, `borderRadius="lg"`)
- **Shadcn UI**: Использует классы Tailwind (`className="p-4 rounded-lg"`)

#### 2. Нейминг компонентов
- **Chakra UI**: Более абстрактные имена (`Box`, `SimpleGrid`, `Flex`)
- **Shadcn UI**: Более семантические имена (`Card`, `CardHeader`, `CardContent`)

#### 3. Вложенность компонентов
- **Chakra UI**: Часто требует больше вложенных компонентов
- **Shadcn UI**: Стремится к более плоской структуре

#### 4. Работа с состояниями
- **Chakra UI**: Состояния управляются через пропы (`isSelected`, `isDisabled`)
- **Shadcn UI**: Состояния через условные классы (`className={cn(isSelected ? "..." : "...")}`)

## Преимущества Chakra UI для веб-CRM

1. **Быстрая разработка** — больше готовых компонентов для панелей, форм и фильтров ускоряют вывод продукта
2. **Единообразие интерфейса** — встроенная система дизайн-токенов обеспечивает согласованность
3. **Меньше кода** — меньше написания CSS, меньше тестирования базовых компонентов
4. **Проще поддержка** — обновления через пакетный менеджер, не требуется ручное обновление кода


## Преимущества Shadcn UI

1. **Полный контроль** — компоненты находятся в исходном коде проекта
2. **Меньше размер** — в финальную сборку попадают только используемые компоненты
3. **Лучшая производительность** — статический CSS вместо динамического CSS-in-JS
4. **Легко кастомизируемый визуальный стиль** — простота реализации уикальных визуальных решений

## Факторы выбора для CRM-проектов

### Chakra UI подходит если:

- Необходимо быстро выпустить продукт на рынок
- Команда разработки небольшая
- Нужны готовые компоненты для работы с данными
- Важна консистентность интерфейса
- Требуется долгосрочная поддержка

### Shadcn UI подходит если:

- Важен полный контроль над кодом
- Дизайн должен быть уникальным
- Критична производительность фронтенда
- Строгие требования к визуальной составляющей

## Влияние на проект

| Аспект | Chakra UI | Shadcn UI |
|--------|-----------|-----------|
| **Скорость разработки** | Выше | Ниже |
| **Гибкость дизайна** | Средняя | Высокая |
| **Сложность обновления** | Низкая | Высокая |
| **Кривая обучения** | Средняя | Высокая |
| **Контроль качества** | Проще | Сложнее |

## Заключение

Для переноса десктоп-CRM в веб-версию [] предоставляет оптимальный баланс между скоростью разработки и качеством интерфейса. Готовые компоненты для работы с данными, простота обновлений и встроенная система стилизации делают его предпочтительным выбором для бизнес-приложений. 