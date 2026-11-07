package tecnm.equipo4.barberoApi.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "turno")
public class Turno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idTurno")
    private Long idTurno;

    @Column(name = "fecha")
    private String fecha;

    @Column(name = "horaInicio")
    private String horaInicio;

    @Column(name = "estado")
    private String estado;

    @Column(name = "notasCliente")
    private String notasCliente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idSucursal")
    @JsonIgnoreProperties({"barberos", "hibernateLazyInitializer", "handler"})
    private Sucursal sucursal;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idCliente")
    @JsonIgnoreProperties({"foto", "turnos", "clientesBarberos"})
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idBarbero")
    @JsonIgnoreProperties({"foto", "turnos", "disponibilidades", "clientesBarberos", "sucursal"})
    private Barbero barbero;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idServicio")
    @JsonIgnoreProperties({"turnos"})
    private Servicio servicio;
}