import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Typography, Button, message } from "antd";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import EventForm from "./EventForm";
import EventService from "../../services/EventService";
const { Title } = Typography;
/* extendedProps: Identity<Dictionary>;
start: Identity<DateInput>;
end: Identity<DateInput>;
date: Identity<DateInput>;
allDay: BooleanConstructor;
id: StringConstructor;
groupId: StringConstructor;
title: StringConstructor;
url: StringConstructor;
interactive: BooleanConstructor; */
export default function Events() {
  const [showModalForm, setShowModalForm] = useState(false);
  const [eventSelected, setEventSelected] = useState(null);
  const onCloseModal_Form = async (action = { state: "close" }) => {
    if (action.state === "success") {
      try {
        message.loading({
          content: "Actualizando",
          key: "update",
          duration: 3,
        });
        let {
          data: { response, success, description },
        } = await EventService.getEvents();
        if (success) {
          message.success({
            content: "Actualizado",
            key: "update",
            duration: 3,
          });
          let events = response.map((event) => {
            return {
              id: event.id,
              start: new Date(event.startDate),
              end: new Date(event.endDate),
              title: event.shortTitle,
              fullTitle: event.title,
            };
          });
          setEvents({ toCalendar: events, originals: response });
        } else {
          message.error({
            content: "Error al actualizar. " + description,
            key: "update",
            duration: 3,
          });
        }
      } catch (error) {
        message.error({
          content: "Error. " + error.message,
          key: "update",
          duration: 5,
        });
      }
    }
    setEventSelected(null);
    setShowModalForm(false);
  };
  const [events, setEvents] = useState({ toCalendar: [], originals: [] });
  const getEvents = useCallback(async () => {
    try {
      let {
        data: { response, success, description },
      } = await EventService.getEvents();
      if (success) {
        let events = response.map((event) => {
          return {
            id: event.id,
            start: new Date(event.startDate),
            end: new Date(event.endDate),
            title: event.shortTitle,
            fullTitle: event.title,
          };
        });
        console.log("events",events);
        setEvents({ toCalendar: events, originals: response });
      } else {
        message.error({ content: description, duration: 4, key: "getter" });
      }
    } catch (error) {}
  }, []);
  useEffect(() => {
    getEvents();
  }, [getEvents]);

  const handleEventClick = (clickInfo) => {
    let eventIndex = events.originals.findIndex(
      (event) => event.id === parseInt(clickInfo.event.id)
    );
    setEventSelected(events.originals[eventIndex]);
    setShowModalForm(true);
  };
  return (
    <>
      <Row justify="center">
        <Col style={{ display: "flex", justifyContent: "center" }} span={24}>
          <Title level={3}>Eventos</Title>
        </Col>
        <Col style={{ display: "flex", justifyContent: "center" }} span={24}>
          <Button
            type="primary"
            onClick={() => {
              setShowModalForm(true);
            }}
          >
            + Registrar Evento
          </Button>
        </Col>
        <Col span={20}>
          <FullCalendar
            events={events.toCalendar}
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            eventClick={handleEventClick}
          />
        </Col>
      </Row>
      {showModalForm ? (
        <EventForm
          eventSelected={eventSelected}
          onCloseModal={onCloseModal_Form}
        />
      ) : null}
    </>
  );
}
