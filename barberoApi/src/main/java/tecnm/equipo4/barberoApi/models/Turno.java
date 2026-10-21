package tecnm.equipo4.barberoApi.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "turno")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Turno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idTurno")
    private Long idTurno;

    @Column(name = "fecha")
    private LocalDate fecha;

    @Column(name = "horaInicio")
    private LocalTime horaInicio;

    @Column(name = "estado")
    private String estado;

    @Column(name = "notasCliente")
    private String notasCliente;

    @Column(name = "sucursal")
    private String sucursal;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idBarbero")
    @JsonIgnoreProperties({"turnos", "disponibilidades", "password"})
    private Barbero barbero;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idCliente")
    @JsonIgnoreProperties({"turnos", "password", "barbero"})
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idServicio")
    @JsonIgnoreProperties({"turnos"})
    private Servicio servicio;

    @OneToOne(mappedBy = "turno", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"turno"})
    private Pago pago;
}