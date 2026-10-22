package tecnm.equipo4.barberoApi.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "turno")
public class Turno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_turno")
    private Long idTurno;

    @Column(name = "estado")
    private String estado;

    @Column(name = "fecha")
    private LocalDate fecha;

    @Column(name = "hora_inicio")
    private LocalTime horaInicio;

    @Column(name = "notas_cliente")
    private String notasCliente;

    @Column(name = "sucursal")
    private String sucursal;

    @Column(name = "id_barbero")
    private Long idBarbero;

    @Column(name = "id_cliente")
    private Long idCliente;

    @Column(name = "id_servicio")
    private Long idServicio;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_barbero", referencedColumnName = "id_usuario", insertable = false, updatable = false)
    @JsonIgnoreProperties({"turnos", "disponibilidades", "password"})
    private Barbero barbero;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_cliente", referencedColumnName = "id_usuario", insertable = false, updatable = false)
    @JsonIgnoreProperties({"turnos", "password"})
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_servicio", referencedColumnName = "id_servicio", insertable = false, updatable = false)
    private Servicio servicio;
}